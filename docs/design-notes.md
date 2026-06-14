# 콜리네 텃밭 — 설계 노트 (아키텍처 지도)

> 갱신: 2026-06-13 | 이 문서는 시스템이 "어떻게 맞물려 도는가"를 처음 읽는 사람을 위한 지도다.
> 기능별 "왜"는 `docs/*-pair-notes.md`, 기능별 "무엇을"은 `docs/*-technical-spec.md`. 여긴 그 위, **전체 구조와 횡단 결정**.

---

## 1. 한눈에

전북 고창 부모님 텃밭의 잉여 농작물을 직거래(D2C)하는 플랫폼. **두 목표가 한 몸이다:**

- **비즈니스**: 부모님 농작물 판로 → 성공 기준 = 고구마 한 박스 완판 1회
- **학습**: 풀스택 1인 완주 → 성공 기준 = DB 설계~배포 혼자 끝까지

> 충돌 시 우선순위: 데드라인(2026-07-31) 내 **개발 완주 우선**.

운영자는 아버지(개발자). 관리자 UI를 직접 쓴다 — 그래서 관리자 화면은 "예쁜 것"보다 **틀리면 손해 나는 운영 흐름의 정확성**이 먼저다.

---

## 2. 기술 스택 — 무엇을, 왜

| 영역 | 선택 | 왜 |
|------|------|-----|
| Frontend | **Next.js 16** (App Router, Turbopack) | SSR+SEO, Server Actions로 백엔드 최소화 |
| Backend/DB | **Supabase** (Postgres + Auth + Storage) | 1인 개발에 BaaS가 합리적. RLS로 권한을 DB에 위임 |
| 결제(MVP) | **무통장입금** (수동) | PortOne 셋업 복잡도 대비 MVP 가치 낮음 → Phase 2 |
| 배포 | **Vercel** | Next.js 1급 지원. ⚠️ 아직 파이프라인 미연결 |
| UI | shadcn/ui + Lucide + Tailwind | 당근마켓 디자인 언어(Noto Sans KR, 1px border, aspect-square) |

> ⚠️ **Next 16은 평소의 Next가 아니다.** 파일 규약·API가 훈련 데이터와 다를 수 있다. 코드 전 `node_modules/next/dist/docs/` 확인 (AGENTS.md). 대표 함정: `middleware.ts` → **`proxy.ts`** 개명.

---

## 3. 디렉토리 구조

### app/ — 라우트 그룹으로 소비자/관리자 분리

```
app/
  (consumer)/          ← 공개. 메인·상품·상세·주문·피드
    page.tsx  products/  products/[id]/  order/  feed/
  (admin)/             ← 보호. proxy 게이트 뒤
    login/             ← 인증 진입
    dashboard/
      orders/  products/  products/[id]/  products/new/  feed/
  api/posts/           ← 피드용 라우트 핸들러
```

괄호 그룹 `(consumer)`/`(admin)`은 **URL에 안 드러나는 논리적 분리**다. 덕분에 관리자 전체를 `proxy.ts` matcher 하나(`/dashboard/*`, `/login`)로 감쌀 수 있다.

### src/ — FSD (Feature-Sliced Design)

```
src/
  entities/    도메인 단위 (표시·조회)   order  post  product
  features/    사용자 행동 (변경·액션)   manage-order  manage-product  order-product  feed
  shared/      공용                     ui  lib(supabase)  utils
  widgets/     (선언만, 현재 비어 있음)
```

---

## 4. FSD 철칙 — 의존성은 한 방향

```
app  →  features  →  entities  →  shared
(위가 아래를 import. 역방향 절대 금지. eslint-plugin-boundaries로 강제)
```

이게 깨지기 쉬운 지점과 우리 해법:

- **entities가 features를 품어야 할 때** → 직접 import 금지. `children` 슬롯으로 받고, 조립은 위 레이어(page)가 한다. (예: `OrderCard`(entities) + `OrderStatusControl`(features) → page에서 합침). 자세히: [admin-orders-pair-notes.md §3](admin-orders-pair-notes.md).

판단 한 줄: **"이 import 화살표가 위로 가는가?"** 가면 멈춰라.

---

## 5. 데이터 모델

Phase 1은 **단일 농장**이라 `farm_id` 없는 단순 스키마. (Phase 3 SaaS 시점에 FK 추가 마이그레이션 1회로 전환)

```
products ──< orders >── customers
(1)    (N)    (1)   (N)
   orders.product_id → products.id   (N:1)
   customers.order_id → orders.id    (1:N, 실질 1:1)

posts (독립)  type: photo | youtube
```

| 테이블 | 핵심 컬럼 |
|--------|-----------|
| products | name, description, price, stock, image_url, status(active/sold_out/hidden), updated_at |
| orders | product_id, qty, total_price, status(pending/confirmed/shipped/done) |
| customers | order_id, name, phone, address, memo |
| posts | type, image_url, youtube_url, body |

### RLS — 권한을 DB에 위임

- 조회: products/posts는 누구나(`using true`), **orders/customers는 authenticated(관리자)만**.
- 쓰기: 주문/배송지 생성은 누구나(소비자 주문), 나머지 변경은 authenticated.

→ 관리자 데이터 보호가 **DB 레벨에 박혀 있어서**, `proxy` 게이트로 로그인만 시키면 서버 클라이언트의 세션 쿠키로 자동 통과. 앱에서 권한 코드를 또 짤 필요가 없다.

### ⚠️ 트리거 (라이브에만 존재)

`updated_at` 자동 갱신, 주문 시 stock 감소 / 취소 시 stock 복구 트리거가 **라이브 DB엔 있으나 `schema.sql`엔 없다**(PostgREST로 DDL 조회 불가). §9 참고. 권위 스키마는 `supabase db dump`로.

---

## 6. 인증 — proxy 게이트 (Next 16)

```
proxy.ts (matcher: /dashboard/*, /login)
  └─ updateSession(): Supabase 세션 쿠키 갱신 + 보호 판정
       비로그인 + /dashboard/* → /login 리다이렉트
       로그인  + /login        → /dashboard/orders

dashboard/layout.tsx → 서버에서 getUser() 재확인 (이중 방어)
```

계정은 Supabase 대시보드에서 수동 생성(단일 관리자). 자세히: [admin-auth-technical-spec.md](admin-auth-technical-spec.md).

---

## 7. 핵심 패턴 (횡단 컨벤션)

- **데이터 변경 = Server Action + `useActionState`.** 폼은 클라이언트, 처리는 서버. (`submitOrder`, `updateOrderStatus`, `saveProduct`, `login`)
- **운영 상태는 서버 신뢰(server-authoritative).** 낙관적 UI는 "틀려도 손해 없는 곳"에만(소비자 피드 O / 주문·재고 X). 변경 후 `revalidatePath`로 서버가 다시 그린다. → [orders pair-notes §4](admin-orders-pair-notes.md).
- **검증은 서버에서(신뢰의 경계).** 클라이언트 `required`는 UX, 서버 검증이 보안. → [products pair-notes §4](admin-products-pair-notes.md).
- **Supabase 클라이언트 두 종류.** `shared/lib/supabase/server.ts`(쿠키 기반, 서버 컴포넌트·액션) / `client.ts`(브라우저) / `proxy.ts`(요청·응답 쿠키, 게이트용).
- **이미지는 외부 URL.** Storage 버킷이 라이브에 없어서 MVP는 URL 입력 방식. 업로드는 버킷 생성 후.

---

## 8. 알려진 리스크 / 기술부채

정직하게 깃발 꽂아두는 곳. (모르는 척이 제일 위험)

| 항목 | 상태 | 메모 |
|------|------|------|
| **스키마 드리프트** | 진행형 패턴 | `schema.sql`이 라이브보다 자주 뒤처짐(total_price/memo/youtube_url/description이 모두 사후 발견·동기화됨). 신규 작업 전 **라이브 검증 습관**으로 대응 중 |
| 트리거 미캡처 | 미해결 | updated_at·stock 트리거가 schema.sql에 없음. `supabase db dump` 필요 |
| Database 타입 Relationships | 비어 있음(4곳) | supabase-js 조인 추론 불가 → `.returns<>()`로 우회 중. 근본 해결은 타입 채우기 |
| `lib/supabase/*` | dead 중복 | `src/shared/lib/supabase/*`의 미사용 복사본(import 0) |
| images 버킷 | 미존재 | schema.sql엔 선언, 라이브엔 없음. 현 이미지 전부 외부 URL |
| seed 중복 | 데이터 | products/orders에 동일 행 다수(seed 다회 투입 흔적) |
| `widgets` 레이어 | 빈 껍데기 | tsconfig 경로만 있고 파일 0 |
| Vercel 배포 | 미연결 | 실제 URL 없음 → 아버지 폰 테스트 불가 |

---

## 9. 문서 체계

기능마다 **둘**, 그리고 전체에 **하나**:

```
docs/
  design-notes.md             ← (이 문서) 전체 아키텍처
  <feature>-technical-spec.md ← 기능별: 무엇을 (구조·데이터·흐름)
  <feature>-pair-notes.md     ← 기능별: 왜 (결정·트레이드오프·교훈, 학습용)
```

규칙은 `AGENTS.md`에 codified. Notion에는 작업일지(시간순) + 페어 노트(학습 아카이브)를 미러링.

---

## 10. 로드맵

- **Phase 1 (지금) — MVP**: 고구마 1박스 완판.
  - 인프라 ✅ / 소비자 화면 ✅ / 관리자: 인증 ✅ 주문 ✅ 상품 ✅ · **피드 등록 남음** · Vercel 배포 남음 · E2E·판매 실험 남음
- **Phase 2 — 자동화**: PortOne 결제, Kakao 알림톡, 오픈뱅킹
- **Phase 3 — SaaS**: `farm_id` 멀티테넌시, 타 농가 입점
- **Phase 4 — 사업화**: 유료 전환

> 원칙: 복잡도 추가 제안은 "7/31 완주 가능 여부"로 판단. Phase 2/3 기능을 MVP에 끼워 넣지 않는다.
