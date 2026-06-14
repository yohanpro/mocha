<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 문서 작성 규칙 (필수)

이 프로젝트의 문서는 **학습을 위한 페어프로그래밍 노트**다. 단순 기록·명세가 아니라, 실리콘밸리 시니어가 옆에서 *"왜 이렇게 했고, 무엇을 조심해야 하는지"*를 가르치듯 쓴다. (오너가 풀스택을 학습 중이라 문서가 곧 교재다.)

## 기능/작업마다 docs/ 에 둘을 남긴다

1. **`<feature>-technical-spec.md` — 무엇을(What).** 구조·데이터·흐름의 레퍼런스. 예: [docs/admin-orders-technical-spec.md](docs/admin-orders-technical-spec.md)
2. **`<feature>-pair-notes.md` — 왜(Why).** 결정·트레이드오프·함정·교훈. **템플릿이자 기준 예시: [docs/admin-orders-pair-notes.md](docs/admin-orders-pair-notes.md)** — 새 페어 노트는 이 톤과 구성을 따른다.

## 페어 노트 작성 원칙

- **결정의 WHY와 버린 대안을 명시한다.** "안 한 것"도 적는다 (왜 안 했는지가 교육이다).
- **주니어/시니어가 갈리는 지점**을 짚는다.
- 구체 사례를 **일반 원칙으로 추상화**해 "다음에 쓸 교훈"으로 남긴다.
- 코드 덤프는 spec에 두고, 페어 노트에선 **판단을 본다.**
- **진행하면서** 함께 갱신한다 — 끝나고 몰아 쓰지 않는다.
- 발견한 리스크/드리프트는 추측하지 말고 **검증 후 사실로** 적는다. 못 본 것은 깃발(NOTE)을 꽂는다.

## 작업 기록 동기화

기능 완료 시 docs와 함께 **Notion 현황 문서 작업일지**(「콜리네 텃밭 — 프로젝트 현황」)에도 진행분을 추가한다.
