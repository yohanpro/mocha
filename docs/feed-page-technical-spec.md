# 일상 피드 페이지 — 기술 설계 문서

> 작성일: 2026-06-08 | 대상: `app/(consumer)/feed/page.tsx`

---

## 1. 데이터 구조

`posts` 테이블은 `type` 컬럼으로 두 가지 콘텐츠를 구분한다.

| type | 사용 컬럼 | 비고 |
|------|-----------|------|
| `photo` | `image_url` | Supabase Storage 퍼블릭 URL |
| `youtube` | `youtube_url` | 유튜브 원본 링크 |

공통 컬럼: `id`, `body` (글), `created_at`

---

## 2. 컴포넌트 분리 전략

```
app/(consumer)/feed/page.tsx          ← Server Component
  └─ src/entities/post/ui/PostCard.tsx ← Server Component (photo 타입)
  └─ src/entities/post/ui/YoutubeEmbed.tsx ← "use client" (iframe은 브라우저 전용)
```

**왜 분리하나?**
- 피드 목록 자체는 서버에서 렌더 → JS 번들 절감 + SEO
- YouTube `<iframe>`은 브라우저에서만 동작 → 해당 부분만 클라이언트로 격리

---

## 3. YouTube URL 파싱

유튜브 URL은 아래 3가지 형태가 혼재한다.

```
https://www.youtube.com/watch?v=ABC123xyz
https://youtu.be/ABC123xyz
https://www.youtube.com/shorts/ABC123xyz
```

비디오 ID를 추출해 embed URL로 변환한다.

```ts
// src/shared/utils/youtube.ts
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function toEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
```

---

## 4. 이미지 렌더링

Supabase Storage 퍼블릭 URL을 `next.config.ts`에 허용 도메인으로 추가해야 Next.js `<Image>`가 동작한다.

```ts
// next.config.ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};
```

`<Image>`를 쓰면 WebP 자동 변환 + lazy loading이 적용된다. 피드처럼 이미지가 많은 페이지에서 성능 차이가 크다.

---

## 5. 페이지네이션

MVP 단계에서는 전체 로드. 게시물이 50개 이상이 되면 커서 기반으로 전환한다.

```ts
// 현재 (MVP)
getPosts()  // 전체

// 추후 (Phase 2)
getPosts({ cursor: lastId, limit: 20 })
```

---

## 6. 레이아웃

당근 피드 참고 — **세로 단일 컬럼**, 이미지 full-width, 텍스트 하단.

```
┌──────────────────────────┐
│  [이미지 or YouTube]      │  ← aspect-video (16:9) or aspect-square
│                          │
├──────────────────────────┤
│  글 내용                  │
│  날짜                     │
└──────────────────────────┘
```

- 모바일: 1컬럼
- 데스크톱: max-width 680px 중앙 정렬 (인스타그램식)

---

## 7. 구현 순서

1. `src/shared/utils/youtube.ts` — YouTube 파싱 유틸
2. `next.config.ts` — 이미지 도메인 허용
3. `src/entities/post/ui/YoutubeEmbed.tsx` — Client Component
4. `src/entities/post/ui/PostCard.tsx` — photo/youtube 분기
5. `app/(consumer)/feed/page.tsx` — 페이지 조립
