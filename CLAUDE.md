# ORDO LAYER 카페24 쇼핑몰 개발 인수인계 문서

> **다음 Claude(AI)가 작업을 이어받을 때 반드시 전체를 읽고 시작하세요.**
> 마지막 업데이트: 2026-06-27

---

## 🔴 절대 규칙 (위반 시 심각한 문제 발생)

1. `<!--@define(cmc_log)-->` → product/detail.html 마지막 줄. **절대 삭제 금지**
2. 카페24 편집기 **"일괄변경" 버튼 절대 사용 금지** → 브라우저 freeze
3. **한 번에 하나의 문제만 수정** → 여러 문제 동시 수정 시 정상 작동하던 부분까지 깨짐
4. **카페24 파일 수정 = 사용자 직접 / GitHub·기타 = AI 담당**
5. **사용자가 지시한 오류만 수정** — 지시하지 않은 부분 절대 건드리지 않음
6. 설명은 짧게. "어떤 파일 열어서 어떤 코드로 바꾸세요" 형식으로만
7. 코드 확인 시 반드시 `get_page_text`로 전체 읽기 — 스크롤 캡처·일부만 보고 판단 금지
8. 질문에 먼저 답변할 것 — 작업 전 질문 답변 우선
9. 수정 후 반드시 라이브 페이지 직접 확인 후 결과 보고 — 확인 없이 "완료" 보고 금지

---

## 📋 역할 분담

| 작업 | 담당 |
|---|---|
| 카페24 편집기에서 파일 저장 | **사용자** |
| GitHub 코드 수정·커밋 | **AI** |
| 코드 분석·디버깅·수정 내용 안내 | **AI** |

---

## 🏗️ 프로젝트 개요

- **쇼핑몰**: carryting.cafe24.com
- **스킨**: skin7, skin_no: 11, shop_no: 1
- **GitHub**: https://github.com/viewmdo-stack/ordo-landing

**목표**: 단일 랜딩페이지. 회원가입 없이 빠른 비회원 구매 (noMember=1)

### 구매 흐름

```
/product/detail.html?product_no=11
→ 하단 [후기 | 구매하기] 고정 바 (처음부터 visible)
→ "구매하기" 클릭 → 커스텀 바텀시트 열림
→ 옵션 복수 선택(체크박스) + 개별 수량 조절
→ 바텀시트 "구매하기" 클릭
→ AJAX POST /exec/front/order/basket/ (옵션별 순차 처리)
→ /order/basket.html ("주문 확인" 페이지)
→ 수량 조절, 삭제 버튼, "결제하기"
→ /order/orderform.html → 결제 완료
```

---

## 📁 주요 파일 현황

### product/detail.html (카페24 스킨)

**GitHub 백업**: `detail.html` (3426 lines, 120KB)

**USER DEFINED style 블록 — 카페24 기본 UI 숨김:**

```css
.xans-product-option { display: none !important; }
.xans-product-quantity { display: none !important; }
.guideArea { display: none !important; }
.totalPrice { display: none !important; }
#orderFixArea { display: none !important; }
.action_button { display: none !important; }
```

> 이유: 카페24 기본 옵션/수량/버튼 UI를 숨기고 커스텀 바텀시트로 대체.
> style[0] (인라인 858자)에 `.action_button{display:flex!important}`가 있어서 USER DEFINED에서 덮어써야 함.

**Basket API 파라미터 (옵션별 순차 AJAX):**

```javascript
var params = [
  'selected_item%5B%5D=1%7C%7C' + encodeURIComponent(it.opt1),
    'relation_product=yes',
      'is_individual=F',
        'product_no=11',
          'main_cate_no=0',
            'display_group=0',
              'option_type=F',
                'product_min=1',
                  'command=add',
                    'has_option=T',
                      'product_price=26180',
                        'multi_option_schema=',
                          'multi_option_data=',
                            'delvType=A',
                              'redirect=2',
                                'product_max_type=F',
                                  'product_max=-1',
                                    'basket_type=A0000',
                                      'ch_ref=',
                                        'prd_detail_ship_type=',
                                          'quantity=' + it.qty,
                                            'is_direct_buy=F',
                                              'optionids%5B%5D=option1',
                                                'needed%5B%5D=option1',
                                                  'option1=' + encodeURIComponent(it.opt1),
                                                    'is_cultural_tax=F',
                                                      'noMember=1'
                                                      ].join('&');
                                                      ```

                                                      **옵션 코드 매핑:**

                                                      | 옵션 | data-code | option1 값 |
                                                      |---|---|---|
                                                      | 바디워시 | wash | P000000L000B |
                                                      | 바디스프레이 | spray | P000000L000C |
                                                      | 세트 | set | P000000L000A |

                                                      **가격:**
                                                      - BASE_PRICE = 26180 (할인가)
                                                      - wash: +0 / spray: +4000 / set: +25800

                                                      ---

                                                      ### order/basket.html (카페24 스킨)

                                                      "주문 확인" 페이지로 커스텀 변환된 파일.

                                                      **2026-06-27 라이브 확인 결과 — 현재 전체 정상 동작:**
                                                      - ✅ `.btnDelete` 숨김 → `display: none` 확인됨
                                                      - ✅ "결제하기" 버튼 텍스트 정상
                                                      - ✅ "삭제" 버튼 → `Basket.deleteBasketItem(0); return false;` 정상
                                                      - ✅ 수량 버튼 (a.down / a.up) → 26×26px, border: 1px solid #ddd, border-radius: 50%, position: static, display: flex, ::after로 문자 표시

                                                      **첫 번째 style 블록 핵심:**

                                                      ```css
                                                      /* X버튼(btnDelete) 숨김 — 수량 옆 "삭제" 버튼만 사용 */
                                                      .btnDelete { display: none !important; }

                                                      /* 수량 영역 표시 */
                                                      .prdBox .quantity { display: flex !important; align-items: center !important; }
                                                      ```

                                                      **두 번째 script 블록 — ordoBasketInit() 함수:**

                                                      ```javascript
                                                      function ordoBasketInit() {
                                                        // ① 결제하기 버튼 텍스트 수정
                                                          document.querySelectorAll('a.btnSubmit.gFull.sizeL').forEach(function(btn) {
                                                              if (btn.textContent.trim() !== '결제하기') {
                                                                    btn.textContent = '결제하기';
                                                                        }
                                                                          });

                                                                            // ② 변경 버튼 → 삭제 버튼 (Basket.deleteBasketItem 직접 호출)
                                                                              document.querySelectorAll('a.btnNormal.sizeQty').forEach(function(btn, index) {
                                                                                  if (btn.textContent.trim() === '변경') {
                                                                                        btn.textContent = '삭제';
                                                                                              btn.setAttribute('onclick', 'Basket.deleteBasketItem(' + index + ');return false;');
                                                                                                  }
                                                                                                    });
                                                                                                    }
                                                                                                    // DOMContentLoaded + load + setTimeout으로 여러 번 실행 (카페24 동적 렌더링 대응)
                                                                                                    ```

                                                                                                    > ⚠️ ordoBasketInit() 수정 시 반드시 함수 블록 전체를 한 번에 교체할 것.
                                                                                                    > 부분 삽입/삭제 시 구문 오류 발생 이력 있음.

                                                                                                    ---

                                                                                                    ## ✅ 해결 완료 이력

                                                                                                    | 날짜 | 문제 | 해결 방법 |
                                                                                                    |---|---|---|
                                                                                                    | 2026-06 | 카페24 기본 옵션/수량/TOTAL/버튼 영역이 보임 | USER DEFINED style에 6줄 CSS 추가 |
                                                                                                    | 2026-06 | 구매하기 → "입력하신 정보가 올바르지 않습니다" | basket API params 전체 재작성 (실제 카페24 요청 캡처 후) |
                                                                                                    | 2026-06 | basket.html X버튼 보임 | `.btnDelete { display: none !important; }` |
                                                                                                    | 2026-06 | basket.html "변경" 버튼 클릭 시 삭제 안 됨 | `Basket.deleteBasketItem(index)` 직접 호출로 교체 |
                                                                                                    | 2026-06-27 | basket.html 수량 버튼 스타일 · 삭제 버튼 · 결제하기 버튼 전체 라이브 재확인 | 모두 정상 동작 확인. 미해결 항목 없음 |

                                                                                                    ---

                                                                                                    ## ⚠️ 미해결 항목

                                                                                                    없음 (2026-06-27 기준 모든 기능 정상 동작 확인)

                                                                                                    다음 작업이 생기면 여기에 추가할 것.

                                                                                                    ---

                                                                                                    ## 🐛 AI가 범하기 쉬운 실수 패턴 (반드시 읽을 것)

                                                                                                    ### 실수 1: 코드 교체 시 잔재 남김
                                                                                                    부분 교체 지시로 구문 오류 발생한 실제 사례:
                                                                                                    ```
                                                                                                    document.querySelectorAll('a.btnNormal.document.querySelectorAll('a.btnNormal.sizeQty')...
                                                                                                    ```
                                                                                                    → **교체 시 반드시 해당 블록 전체를 한 번에 교체**

                                                                                                    ### 실수 2: CSS 확인 없이 반복 시도
                                                                                                    카페24 기본 CSS 확인 없이 덮어쓰기 반복 → 효과 없음.
                                                                                                    → **CSS 수정 전 `window.getComputedStyle()`로 현재 적용값 먼저 확인**

                                                                                                    ### 실수 3: 저장 확인 없이 진행
                                                                                                    편집기 저장 가정하고 진행 → 미반영 상태에서 디버깅.
                                                                                                    → **수정 후 반드시 라이브 페이지 reload + JS로 실제 적용값 재확인**

                                                                                                    ### 실수 4: 관리자 환경에서 API 테스트
                                                                                                    관리자 로그인 상태에서 `/exec/front/order/basket/` 호출 시 result:-999 반환 → 이것은 정상 (관리자 차단).
                                                                                                    → **실제 비회원 환경(시크릿 창)에서만 테스트할 것**

                                                                                                    ### 실수 5: 지시하지 않은 부분 수정
                                                                                                    → **사용자가 명시적으로 지시한 것만 수정. 나머지는 절대 건드리지 않음**

                                                                                                    ### 실수 6: 여러 문제 동시 수정
                                                                                                    여러 문제를 한 번에 고치려다 정상 작동하던 부분까지 깨짐 (2026-06 반복 경험).
                                                                                                    → **하나 수정 → 라이브 확인 → 다음 수정**

                                                                                                    ### 실수 7: 일부만 보고 판단
                                                                                                    스크롤 캡처나 일부만 보고 코드 판단 → 맥락 오해로 잘못된 수정.
                                                                                                    → **반드시 `get_page_text`로 파일 전체를 읽은 후 판단**

                                                                                                    ---

                                                                                                    ## 📌 작업 원칙 요약 (다음 AI 필독)

                                                                                                    1. **지시한 것만** — 요청하지 않은 개선·최적화 금지
                                                                                                    2. **카페24 편집기는 사용자가** — AI는 "어디서 무엇을 어떻게 바꾸라"고만 안내
                                                                                                    3. **응급처치 코드 금지** — 실제 판매 사이트. 처음부터 안전하게 작성
                                                                                                    4. **설명은 간결하게** — 불필요한 장황한 설명 없이 핵심만
                                                                                                    5. **한 번에 하나씩** — 여러 문제 동시 수정 금지
                                                                                                    6. **작업 완료 후 라이브 확인 필수** — 확인 없이 "완료" 보고 금지
                                                                                                    7. **get_page_text로 전체 읽기** — 스크롤 캡처·일부만 보고 판단 금지
                                                            
                                                            
                                                            ---
                                                            
                                                            ## 2026-06-29 작업: 리뷰 카드형 변환 (ec-base-table -> 카드 UI)
                                                            
                                                            ### 배경
                                                            breview 위젯(iframe)이 스태프 리뷰를 카드형으로 보여주고, 일반 사용자 리뷰는 ec-base-table 테이블형으로 표시되어 시각적 불일치 발생.
                                                            ec-base-table을 CSS grid로 카드형으로 변환.
                                                            
                                                            ### TD 순서 (절대 준수)
                                                            
                                                            | nth-child | className | 내용 | grid 배치 |
                                                            |---|---|---|---|
                                                            | 1 | RW | 번호 | 숨김 |
                                                            | 2 | subject left txtBreak | 제목/내용(a링크) | row2, col 1/5 |
                                                            | 3 | (없음) | 작성자명 | row1, col 2 |
                                                            | 4 | (없음) | 작성일 | row1, col 3 |
                                                            | 5 | (없음) | 조회수 | 숨김 |
                                                            | 6 | (없음) | 별점 img | row1, col 1 |
                                                            
                                                            **주의: 별점은 6번째 td이지만 grid col 1에 배치됨. nth-child 순서와 grid 배치 순서가 다름.**
                                                            
                                                            ---
                                                            
                                                            ### 신규 실수 패턴 (2026-06-29)
                                                            
                                                            **실수 A: showReviews 함수 정의 후 호출 코드 누락**
                                                            함수를 정의만 하고 실행(호출) 코드를 빠뜨림 -> 화면 변화 없음.
                                                            해결: 함수 정의 직후 즉시호출 + setTimeout 4회 추가 필수
                                                            
                                                            **실수 B: tbody 너비를 CSS width:100%로만 해결 시도**
                                                            display:block 전환 후 table 레이아웃에서 보서지면 CSS width:100% 무효 (335px 고정).
                                                            해결: JS에서 t.offsetWidth로 px값 직접 설정 필수
                                                            
                                                            **실수 C: t.offsetWidth = 0 타이밍 미대비**
                                                            breview iframe이 비동기 로딩되므로 즉시 실행 시 offsetWidth=0 반환.
                                                            해결: t.offsetWidth || t.parentElement.offsetWidth + if(w > 0) 조건 추가할
                                                            **실수 D: setTimeout 횟수 부족**
                                                            breview 비동기 로딩이 ec-base-table을 나중에 다시 숨기는 타이밍 존재.
                                                            해결: 즉시 + 300ms + 800ms + 1500ms 총 4회 실행 필수
                                                            
                                                            **실수 E: td nth-child 순서와 grid 배치 혼동**
                                                            별점은 DOM 6번째 td이지만 grid에서는 col 1로 배치.
                                                            해결: 작업 전 document.querySelectorAll('td')로 실제 DOM 순서 재확인                                        8. **질문 먼저 답변** — 작업 전 질문 답변 우선