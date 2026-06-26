# ORDO LAYER 카페24 개발 인수인계 문서

> 이 문서는 다음 Claude(AI)가 작업을 이어받을 때 읽는 문서입니다.
> > 반드시 전체를 읽고 작업을 시작하세요.
> >
> > ---
> >
> > ## 🔴 절대 규칙 (위반 시 심각한 문제 발생)
> >
> > 1. **`<!--@define(cmc_log)-->`** → `product/detail.html` 마지막 줄. **절대 삭제 금지**
> > 2. 2. **카페24 편집기 "일괄변경" 버튼 절대 사용 금지** → 브라우저 freeze
> >    3. 3. **한 번에 하나의 문제만 수정** → 여러 문제 동시 수정 시 정상 작동하던 부분까지 깨짐
> >       4. 4. **카페24 파일 수정 = 사용자 직접** / **GitHub·기타 = AI 담당**
> >          5. 5. **사용자가 지시한 오류만 수정. 지시하지 않은 부분 절대 건드리지 않음**
> >             6. 6. **설명은 짧게. "어떤 파일 열어서 어떤 코드로 바꾸세요" 형식으로만**
> >               
> >                7. ---
> >               
> >                8. ## 📋 역할 분담
> >               
> >                9. | 작업 | 담당 |
> > |------|------|
> > | 카페24 편집기에서 파일 저장 | 사용자 |
> > | GitHub 코드 수정·커밋 | AI |
> > | 코드 분석·디버깅·수정 내용 안내 | AI |
> >
> > ---
> >
> > ## 🏗️ 프로젝트 개요
> >
> > - **쇼핑몰:** carryting.cafe24.com
> > - - **스킨:** skin7, skin_no: 11, shop_no: 1
> >   - - **GitHub:** https://github.com/viewmdo-stack/ordo-landing
> >     - - **목표:** 단일 랜딩페이지. 회원가입 없이 빠른 비회원 구매 (noMember=1)
> >      
> >       - ### 구매 흐름
> >       - ```
> >         /product/detail.html?product_no=11
> >         → 하단 [후기 | 구매하기] 고정 바 (처음부터 visible)
> >         → "구매하기" 클릭 → 커스텀 바텀시트 열림
> >         → 옵션 복수 선택(체크박스) + 개별 수량 조절
> >         → 바텀시트 "구매하기" 클릭
> >         → AJAX POST /exec/front/order/basket/ (옵션별 순차 처리)
> >         → /order/basket.html ("주문 확인" 페이지)
> >         → 수량 조절, 삭제 버튼, "결제하기"
> >         → /order/orderform.html → 결제 완료
> >         ```
> >
> > ---

## 📁 주요 파일 현황

### `product/detail.html` (카페24 스킨)

**USER DEFINED `<style>` 블록 — 카페24 기본 UI 숨김:**
```css
.xans-product-option { display: none !important; }
.xans-product-quantity { display: none !important; }
.guideArea { display: none !important; }
.totalPrice { display: none !important; }
#orderFixArea { display: none !important; }
.action_button { display: none !important; }
```
> 이유: 카페24 기본 옵션/수량/버튼 UI를 숨기고 커스텀 바텀시트로 대체.
> > `style[0]` (인라인 858자)에 `.action_button{display:flex!important}`가 있어서 USER DEFINED에서 덮어써야 함.
> >
> > **Basket API 파라미터 (옵션별 순차 AJAX):**
> > ```javascript
> > var params = [
> >   'selected_item%5B%5D=1%7C%7C' + encodeURIComponent(it.opt1),
> >   'relation_product=yes',
> >   'is_individual=F',
> >   'product_no=11',
> >   'main_cate_no=0',
> >   'display_group=0',
> >   'option_type=F',
> >   'product_min=1',
> >   'command=add',
> >   'has_option=T',
> >   'product_price=26180',
> >   'multi_option_schema=',
> >   'multi_option_data=',
> >   'delvType=A',
> >   'redirect=2',
> >   'product_max_type=F',
> >   'product_max=-1',
> >   'basket_type=A0000',
> >   'ch_ref=',
> >   'prd_detail_ship_type=',
> >   'quantity=' + it.qty,
> >   'is_direct_buy=F',
> >   'optionids%5B%5D=option1',
> >   'needed%5B%5D=option1',
> >   'option1=' + encodeURIComponent(it.opt1),
> >   'is_cultural_tax=F',
> >   'noMember=1'
> > ].join('&');
> > ```
> >
> > **옵션 코드 매핑:**
> > | 옵션 | data-code | option1 값 |
> > |------|-----------|------------|
> > | 바디워시 | wash | P000000L000B |
> > | 바디스프레이 | spray | P000000L000C |
> > | 세트 | set | P000000L000A |
> >
> > **가격:**
> > - BASE_PRICE = 26180 (할인가)
> > - - wash: +0 / spray: +4000 / set: +25800
> >  
> >   - ---
> >
> > ### `order/basket.html` (카페24 스킨)
> >
> > "주문 확인" 페이지로 커스텀 변환된 파일.
> >
> > **첫 번째 `<style>` 블록 핵심:**
> > ```css
> > /* X버튼(btnDelete) 숨김 — 수량 옆 "삭제" 버튼만 사용 */
> > .btnDelete { display: none !important; }
> >
> > /* 수량 영역 표시 */
> > .prdBox .quantity { display: flex !important; align-items: center !important; }
> > ```
> >
> > **두 번째 `<script>` 블록 — `ordoBasketInit()` 함수 핵심:**
> > ```javascript
> > function ordoBasketInit() {
> >   // ① 결제하기 버튼 텍스트 수정
> >   document.querySelectorAll('a.btnSubmit.gFull.sizeL').forEach(function(btn) {
> >     if (btn.textContent.trim() !== '결제하기') {
> >       btn.textContent = '결제하기';
> >     }
> >   });
> >
> >   // ② 변경 버튼 → 삭제 버튼 (Basket.deleteBasketItem 직접 호출)
> >   document.querySelectorAll('a.btnNormal.sizeQty').forEach(function(btn, index) {
> >     if (btn.textContent.trim() === '변경') {
> >       btn.textContent = '삭제';
> >       btn.setAttribute('onclick', 'Basket.deleteBasketItem(' + index + ');return false;');
> >     }
> >   });
> >   // ... breadcrumb, h3 텍스트 변경 등
> > }
> > // DOMContentLoaded + load + setTimeout 으로 여러 번 실행 (카페24 동적 렌더링 대응)
> > ```
> >
> > > ⚠️ `ordoBasketInit()` 수정 시 반드시 함수 블록 전체를 한 번에 교체할 것.
> > > > 부분 삽입/삭제 시 구문 오류 발생 이력 있음.
> > > >
> > > > ---
> > > >
> > > > ## ✅ 해결 완료 이력
> > > >
> > > > | 날짜 | 문제 | 해결 방법 |
> > > > |------|------|-----------|
> > > > | 2026-06 | 카페24 기본 옵션/수량/TOTAL/버튼 영역이 보임 | USER DEFINED style에 6줄 CSS 추가 |
> > > > | 2026-06 | 구매하기 → "입력하신 정보가 올바르지 않습니다" | basket API params 전체 재작성 (selected_item[], optionids[] 등 누락 수정) |
> > > > | 2026-06 | basket.html X버튼 보임 | `.btnDelete { display: none !important; }` |
> > > > | 2026-06 | basket.html "변경" 버튼 클릭 시 삭제 안 됨 | `Basket.deleteBasketItem(index)` 직접 호출로 교체 |
> > > >
> > > > ---
> > > >
> > > > ## ⚠️ 미해결 항목
> > > >
> > > > ### basket.html 수량 버튼 (-/+) 스타일
> > > > - **목표:** 바텀시트 수량 버튼과 동일 → `26×26px`, `border: 1px solid #ddd`, `border-radius: 50%`, `font-size: 16px`
> > > > - - **문제:** 카페24 기본 CSS에서 `a.up`, `a.down`에 `position: absolute` 적용 중 → `::after` pseudo-element가 1px로 잘림
> > > >   - - **현재 적용 코드 (두 번째 style 블록):**
> > > >     - ```css
> > > >       .ec-base-qty a.up, .ec-base-qty a.down {
> > > >         position: static !important;
> > > >         display: inline-flex !important; align-items: center !important; justify-content: center !important;
> > > >         width: 26px !important; height: 26px !important;
> > > >         border: 1px solid #ddd !important; border-radius: 50% !important;
> > > >         background: #fff !important; color: #000 !important;
> > > >         font-size: 0 !important;
> > > >         text-decoration: none !important; cursor: pointer !important;
> > > >         text-indent: -9999px !important;
> > > >       }
> > > >       .ec-base-qty a.up::after { content: '+' !important; font-size: 16px !important; color: #000 !important; text-indent: 0 !important; display: block !important; }
> > > >       .ec-base-qty a.down::after { content: '-' !important; font-size: 16px !important; color: #000 !important; text-indent: 0 !important; display: block !important; }
> > > >       ```
> > > >       - **다음 시도 제안:** `text-indent` 대신 `span` 요소 직접 삽입 방식 또는 JS로 버튼 내용 직접 교체
> > > >      
> > > >       - ---
> > > >
> > > > ## 🐛 AI가 범하기 쉬운 실수 패턴
> > > >
> > > > ### 실수 1: 코드 교체 시 잔재 남김
> > > > 부분 교체 지시로 아래처럼 깨진 코드 발생:
> > > > ```javascript
> > > > // 이런 식으로 기존 코드 일부가 남아서 구문 오류
> > > > document.querySelectorAll('a.btnNormal.document.querySelectorAll('a.btnNormal.sizeQty')...
> > > > ```
> > > > → **교체 시 반드시 해당 블록 전체를 한 번에 교체 요청할 것**
> > > >
> > > > ### 실수 2: CSS 확인 없이 반복 시도
> > > > 카페24 기본 CSS 확인 없이 덮어쓰기 반복 → 효과 없음.
> > > > → **CSS 수정 전 `window.getComputedStyle()`로 현재 적용값 먼저 확인**
> > > >
> > > > ### 실수 3: 저장 확인 없이 진행
> > > > 편집기 저장 가정하고 진행 → 미반영 상태에서 디버깅.
> > > > → **수정 후 반드시 라이브 페이지 reload + JS로 실제 적용값 재확인**
> > > >
> > > > ### 실수 4: 관리자 환경에서 API 테스트
> > > > 관리자 로그인 상태에서 `/exec/front/order/basket/` 호출 시 result:-999 반환 → 정상.
> > > > 실제 비회원 환경(시크릿 창)에서만 테스트할 것.
> > > > 
