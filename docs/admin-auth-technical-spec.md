# 관리자 인증 — 기술 설계 문서

> 작성일: 2026-06-13 | 대상: `app/(admin)/*`, `proxy.ts`

STEP 3 관리자 화면의 진입 관문. Supabase Auth(이메일/비밀번호) 기반으로 `/dashboard/*`를 보호한다.

---

## 1. ⚠️ Next.js 16 함정 — `middleware.ts` → `proxy.ts`

Next 16에서 미들웨어 파일 규약이 **`proxy.ts`로 이름이 바뀌었다.** 기존 `middleware.ts`는 deprecated.

```ts
// proxy.ts (프로젝트 루트, app/과 같은 레벨)
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] };
```

- 함수명: `proxy` (또는 default export)
- 설정: 기존과 동일하게 `export const config = { matcher }`
- 문서: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

`middleware.ts`로 작성하면 인증 게이트가 통째로 동작하지 않으니 주의.

---

## 2. 파일 구조

```
proxy.ts                                  ← 게이트 진입점 (matcher: /dashboard/*, /login)
src/shared/lib/supabase/proxy.ts          ← updateSession(): 세션 갱신 + 보호 로직
app/(admin)/login/
  ├─ page.tsx                             ← 로그인 화면 (Server Component)
  ├─ LoginForm.tsx                        ← "use client", useActionState
  └─ actions.ts                           ← "use server", login() / logout()
app/(admin)/dashboard/layout.tsx          ← 보호 영역 공통 상단바 + 이중 방어
```

기존 소비자 코드(`app/(consumer)/*`)는 변경 없음.

---

## 3. 인증 흐름

```
[비로그인]
  /dashboard/orders 요청
    → proxy: getUser() == null
    → /login 리다이렉트

[로그인]
  /login 폼 제출
    → login() 서버액션: signInWithPassword()
    → 성공 시 세션 쿠키 set → /dashboard/orders 리다이렉트
    → 실패 시 에러 문자열 반환 (페이지 유지)

[로그인 상태로 /login 재방문]
  → proxy: getUser() != null
  → /dashboard/orders 리다이렉트 (이미 로그인됨)

[로그아웃]
  layout 상단바 로그아웃 → logout() 서버액션: signOut() → /login
```

---

## 4. 게이트 — `proxy.ts` + `updateSession()`

proxy는 CDN 엣지에서 동작할 수 있어 렌더 코드와 분리된다. Supabase 세션 쿠키를 매 요청마다 갱신하면서 보호를 함께 처리한다.

```ts
// src/shared/lib/supabase/proxy.ts (핵심)
const { data: { user } } = await supabase.auth.getUser();
const { pathname } = request.nextUrl;

// 비로그인 → 대시보드 차단
if (!user && pathname.startsWith("/dashboard")) redirect("/login");

// 로그인 상태로 로그인 페이지 → 대시보드
if (user && pathname === "/login") redirect("/dashboard/orders");
```

`config.matcher`로 `/dashboard/:path*` 와 `/login`에만 적용 → 소비자 페이지엔 오버헤드 없음.

---

## 5. 로그인 — 서버액션 + `useActionState`

기존 주문 폼(`OrderForm`)과 동일하게 React 19 `useActionState` 패턴을 따른다.

```ts
// app/(admin)/login/actions.ts
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  redirect("/dashboard/orders");
}
```

- 에러는 사용자에게 일반화된 메시지로 노출 (계정 존재 여부 누설 방지)
- `redirect()`는 서버액션에서 호출 → 클라이언트 네비게이션 처리

---

## 6. 이중 방어 — `dashboard/layout.tsx`

proxy가 1차 게이트지만, 서버 렌더 시점에도 한 번 더 확인한다. (proxy 누락·matcher 오설정 대비)

```ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

레이아웃은 보호 영역 공통 상단바(브랜드 · 로그인 이메일 · 로그아웃 버튼)도 함께 제공한다.

---

## 7. 계정 운영

MVP 단계에서는 관리자 1명. 계정은 **Supabase 대시보드에서 수동 생성**한다.

```
Authentication > Users > Add user
  Email: admin@colline.kr
  Password: (임시 — 운영 전 변경)
  ✅ Auto Confirm User
```

- service role key는 레포에 두지 않음 (대시보드 수동 생성으로 회피)
- 임시 크레덴셜은 `.env.local`에 주석 메모로만 기록 (코드는 참조하지 않음)

---

## 8. 검증 결과 (2026-06-13)

| 시나리오 | 결과 |
|---|---|
| 비로그인 → `/dashboard` | `/login` 차단 ✅ |
| 틀린 비밀번호 | 에러 표시, 페이지 유지 ✅ |
| 정상 로그인 | `/dashboard/orders` 진입 ✅ |
| 로그아웃 | `/login` 이동 ✅ |
| 로그아웃 후 재접근 | 다시 차단 ✅ |

---

## 9. 다음 단계 (STEP 3 잔여)

이 게이트 안에 얹을 관리자 화면 — 모두 현재 placeholder.

1. 주문 목록 — 조회 → 입금 확인 → 상태 변경 (pending→confirmed→shipped→done)
2. 상품 등록/수정 — 사진·수량·가격
3. 일상 피드 등록 — 사진 업로드 + 유튜브
