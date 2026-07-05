# 관리자 피드 등록/관리 — 기술 스펙 (What)

> 작성일: 2026-07-05 | 대상: `app/(admin)/dashboard/feed/*`, `src/features/manage-post/*`, `src/entities/post/api.ts`
>
> "왜"는 [manage-feed-pair-notes.md](manage-feed-pair-notes.md)에. 여긴 구조·데이터·흐름의 레퍼런스.

---

## 1. 한눈에

운영자가 소비자 피드(`/feed`)에 올릴 게시글을 **등록·삭제**하는 화면. 수정은 없다(§ pair-notes §1). 게시 유형은 `photo`(사진 URL) / `youtube`(링크) 두 가지.

```
/dashboard/feed        목록 + 삭제
/dashboard/feed/new    등록 폼
        │ savePost (insert)
        ▼
     posts 테이블  ──(revalidate)──▶  /feed (소비자), /dashboard/feed (관리자)
```

---

## 2. 파일 구성

| 파일 | 레이어 | 역할 |
|------|--------|------|
| `app/(admin)/dashboard/feed/page.tsx` | app | 목록 서버 컴포넌트. `getAllPosts()` 조회 + 항목별 삭제 `<form>` |
| `app/(admin)/dashboard/feed/new/page.tsx` | app | 등록 페이지. `PostForm` 렌더 |
| `src/features/manage-post/ui/PostForm.tsx` | features | 등록 폼(client). 유형 선택에 따라 미디어 입력 필드 전환 |
| `src/features/manage-post/api/savePost.ts` | features | 등록 Server Action (`useActionState` 시그니처) |
| `src/features/manage-post/api/deletePost.ts` | features | 삭제 Server Action (`<form action>` 바인딩) |
| `src/entities/post/api.ts` | entities | `getAllPosts()` 추가 (관리자용 전체 조회) |

의존 방향: `app → features → entities → shared` (FSD 준수). 소비자 피드가 쓰는 `getPosts`(페이지네이션)·`PostCard`는 손대지 않음.

---

## 3. 데이터

`posts` 테이블 (라이브 검증 완료 — 드리프트 없음):

| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | uuid | PK |
| type | `photo` \| `youtube` | |
| image_url | text \| null | photo일 때만 채움 |
| youtube_url | text \| null | youtube일 때만 채움 |
| body | text \| null | 선택 |
| created_at | timestamptz | 최신순 정렬 키 |

RLS: 쓰기(insert/delete)는 `authenticated`만 → 서버 클라이언트의 세션 쿠키로 통과. 소비자는 조회만.

---

## 4. 흐름

### 등록 (`savePost`)
1. `type` 화이트리스트 검증 (`photo`/`youtube` 외 거부)
2. 유형별 미디어 필수 검증:
   - `youtube` → `youtube_url` 필수 + `extractYoutubeId()`로 형식 검증
   - `photo` → `image_url` 필수
3. 선택한 유형의 미디어만 저장, 반대쪽은 `null`
4. `insert` → `revalidatePath('/dashboard/feed')` + `revalidatePath('/feed')` → `redirect('/dashboard/feed')`
5. 에러는 `{ error }`로 폼에 반환 (`useActionState`)

### 삭제 (`deletePost`)
- 목록 항목의 `<form action={deletePost}>` + hidden `id` → `delete().eq('id', id)` → 두 경로 revalidate
- 낙관적 UI 없음(서버 신뢰). 삭제는 되돌릴 수 없으므로 서버 확정 후 재렌더.

---

## 5. UI 요약

- **목록**: 썸네일(photo=이미지, youtube=`Video` 아이콘) · 본문 미리보기(없으면 "(본문 없음)") · `유형 · 상대시간` · 삭제 버튼(hover 시 destructive)
- **등록 폼**: 유형 select → photo면 `사진 URL`, youtube면 `유튜브 링크` 필드 노출 · 본문(선택) · 등록/취소
- 이미지 도메인은 `next.config.ts`의 `remotePatterns`(`*.supabase.co`, `images.unsplash.com`)만 소비자 피드에서 렌더됨

---

## 6. 알려진 한계 (→ pair-notes §5)

- **이미지 업로드 미구현**: 사진은 외부 URL 입력 방식(Storage 버킷 미존재). 상품과 동일한 우회.
- **관리자 네비게이션 없음**: `/dashboard/feed`는 URL 직접 진입만 가능(대시보드 섹션 이동 메뉴 미구현).
- **수정 없음**: 의도된 설계(등록/삭제만). 오타 수정도 삭제 후 재등록.
