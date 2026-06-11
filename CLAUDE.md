# ORDO LAYER 상세페이지 개발 기준

## 반응형 기준 (절대 변경 금지)
- 기준 디바이스: 아이폰 15 Pro (393px)
- max-width: 430px
- viewport: width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no

## 폰트 사이즈 규칙 (항상 clamp 사용)
- 대형 헤드라인: clamp(24px, 7vw, 32px)
- 중형 헤드라인: clamp(18px, 5vw, 24px)
- 본문: clamp(13px, 3.5vw, 16px)
- 소문자: clamp(11px, 2.8vw, 13px)

## 줄바꿈
- word-break: keep-all 전체 적용 유지
- 핵심 헤드라인 줄바꿈은 br 태그로 고정

## 여백/패딩
- px 고정값 사용 (vw/vh 금지)

## 컬러 시스템
- 네이비: #1a3a6b
- 블루: #2867a8
- 레드: #e02020
- 스트라이프 하늘색: #c8e8f5

## 주의사항
- 이미지/텍스트 편집 시에도 위 기준 유지
- 새 섹션 추가 시에도 동일 기준 적용
- font-size px 고정값 절대 사용 금지
