"use client";

import { useState } from "react";
import { toEmbedUrl } from "@/src/shared/utils/youtube";
import { extractYoutubeId } from "@/src/shared/utils/youtube";

export function YoutubeEmbed({ url }: { url: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const embedUrl = toEmbedUrl(url);
  const videoId = extractYoutubeId(url);

  if (!embedUrl || !videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    // 3. aspect-square로 통일 (그리드 높이 일치)
    // 4. 썸네일 클릭 시에만 iframe 로드 (lazy + 스크롤 트랩 방지)
    <div className="relative w-full aspect-square bg-black overflow-hidden">
      {!isLoaded ? (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="w-full h-full relative group"
          aria-label="YouTube 영상 재생"
        >
          {/* 썸네일 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt="YouTube 썸네일"
            className="w-full h-full object-cover"
          />
          {/* 다크 오버레이 */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          {/* 재생 버튼 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={`${embedUrl}&autoplay=1`}
          title="YouTube 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
