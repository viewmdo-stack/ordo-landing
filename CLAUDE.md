# ORDO LAYER 카페24 스킨 커스터마이징 인수인계서

> **다음 Claude(AI)가 작업을 이어받을 때 반드시 전체를 읽고 시작하세요.**
> > 마지막 업데이트: 2026-06-30
> >
> > ---
> >
> > ## 🔴 절대 규칙 (위반 시 즉시 심각한 문제 발생)
> >
> > 1. **`<!--@define(cmc_log)-->`** → `product/detail.html` 마지막 줄. **절대 삭제 금지**
> > 2. 2. **카페24 편집기 "일괄변경" 버튼 절대 사용 금지** → 브라우저 freeze
> >    3. 3. **한 번에 하나의 문제만 수정** → 여러 문제 동시 수정 시 정상 작동하던 부분까지 깨짐
> >       4. 4. **카페24 파일 수정 = 사용자 직접** / **GitHub·기타 = AI 담당**
> >          5. 5. **사용자가 지시한 오류만 수정. 지시하지 않은 파일·부분 절대 건드리지 않음**
> >             6. 6. **설명은 짧게. "어떤 파일 열어서 어떤 코드로 바꾸세요" 형식으로만**
> >                7. 7. **코드 블록 교체 시 반드시 해당 블록 전체를 한 번에 교체** — 부분 삽입/삭제 지시 금지 (잔재 코드로 구문 오류 발생 이력 있음)
> >                  
> >                   8. ---
> >                  
> >                   9. ## 1. 프로젝트 기본 정보
> >                  
> >                   10. | 항목 | 값 |
> > |------|-----|
> > | 쇼핑몰 도메인 | carryting.cafe24.com |
> > | 편집 스킨명 | skin7 |
> > | 스킨 번호 | skin_no=11 |
> > | 테스트 상품 번호 | product_no=11 |
> > | GitHub 백업 저장소 | github.com/viewmdo-stack/ordo-landing |
> > | GitHub 백업 파일 | detail.html (main 브랜치) |
> > | 에디터 URL | carryting.cafe24.com/disp/admin/editor/main?skin_no=11&skin_code=skin7&shop_no=1 |
> > | 실제 상품 페이지 | carryting.cafe24.com/product/detail.html?product_no=11 |
> >
> > ---
> >
> > ## 2. 역할 분담
> >
> > | 작업 | 담당 |
> > |------|------|
> > | 카페24 편집기에서 파일 저장 | 사용자 |
> > | GitHub 코드 수정·커밋 | AI |
> > | 코드 분석·디버깅·수정 내용 안내 | AI |
> >
> > ---
> >
> > ## 3. 프로젝트 목표 및 구매 흐름
> >
> > **목표:** 단일 랜딩페이지. 회원가입 없이 빠른 비회원 구매 (noMember=1)
> >
> > ```
> > /product/detail.html?product_no=11
> > → 하단 [후기 | 구매하기] 고정 바 (처음부터 visible)
> > → "구매하기" 클릭 → 커스텀 바텀시트 열림
> > → 옵션 복수 선택(체크박스) + 개별 수량 조절
> > → 바텀시트 "구매하기" 클릭
> > → AJAX POST /exec/front/order/basket/ (옵션별 순차 처리)
> > → /order/basket.html ("주문 확인" 페이지)
> > → 수량 조절, 삭제 버튼, "결제하기"
> > → /order/orderform.html → 결제 완료
> > ```
> >
> > ---
> >
> > ## 4. product/detail.html
> >
> > ### 4-1. 주요 줄 번호 (저장 시마다 변동 — 반드시 키워드로 재확인)
> >
> > | 위치 | 내용 | 확인 키워드 |
> > |------|------|------------|
> > | ~762번 | 후기 작성 버튼 HTML | ordo-review-write |
> > | ~1064번 | a.ordo-review-write[href] CSS | ordo-review-write |
> > | ~1065번 | .ordo-review-write CSS (두 번째) | ordo-review-write |
> > | ~1066번 | .breview-preset-target-panel 숨김 CSS | breview-preset-target-panel |
> > | ~1067번 | ec-base-table 카드형 변환 CSS 시작 | ec-base-table 카드형 변환 |
> > | ~1078번 | /\* ===== END ORDO CSS ===== \*/ | END ORDO CSS |
> > | ~1218번 | showReviewWrite JS 함수 | showReviewWrite |
> > | ~1219번 | showReviews JS 함수 + 호출 | showReviews |
> >
> > > ⚠️ 줄 번호 확인: `cm.getValue().split('\n').forEach()` 로 키워드 검색
> > >
> > > ### 4-2. USER DEFINED style 블록 — 카페24 기본 UI 숨김
> > >
> > > ```css
> > > .xans-product-option { display: none !important; }
> > > .xans-product-quantity { display: none !important; }
> > > .guideArea { display: none !important; }
> > > .totalPrice { display: none !important; }
> > > #orderFixArea { display: none !important; }
> > > .action_button { display: none !important; }
> > > ```
> > >
> > > > 이유: 카페24 기본 옵션/수량/버튼 UI를 숨기고 커스텀 바텀시트로 대체.
> > > > > `style[0]` (인라인 858자)에 `.action_button{display:flex!important}`가 있어서 USER DEFINED에서 덮어써야 함.
> > > > >
> > > > > ### 4-3. Basket API 파라미터 (옵션별 순차 AJAX)
> > > > >
> > > > > ```javascript
> > > > > var params = [
> > > > >   'selected_item%5B%5D=1%7C%7C' + encodeURIComponent(it.opt1),
> > > > >   'relation_product=yes',
> > > > >   'is_individual=F',
> > > > >   'product_no=11',
> > > > >   'main_cate_no=0',
> > > > >   'display_group=0',
> > > > >   'option_type=F',
> > > > >   'product_min=1',
> > > > >   'command=add',
> > > > >   'has_option=T',
> > > > >   'product_price=26180',
> > > > >   'multi_option_schema=',
> > > > >   'multi_option_data=',
> > > > >   'delvType=A',
> > > > >   'redirect=2',
> > > > >   'product_max_type=F',
> > > > >   'product_max=-1',
> > > > >   'basket_type=A0000',
> > > > >   'ch_ref=',
> > > > >   'prd_detail_ship_type=',
> > > > >   'quantity=' + it.qty,
> > > > >   'is_direct_buy=F',
> > > > >   'optionids%5B%5D=option1',
> > > > >   'needed%5B%5D=option1',
> > > > >   'option1=' + encodeURIComponent(it.opt1),
> > > > >   'is_cultural_tax=F',
> > > > >   'noMember=1'
> > > > > ].join('&');
> > > > > ```
> > > > >
> > > > > ### 4-4. 옵션 코드 매핑
> > > > >
> > > > > | 옵션 | data-code | option1 값 |
> > > > > |------|-----------|------------|
> > > > > | 바디워시 | wash | P000000L000B |
> > > > > | 바디스프레이 | spray | P000000L000C |
> > > > > | 세트 | set | P000000L000A |
> > > > >
> > > > > - BASE_PRICE = 26180 (할인가)
> > > > > - - wash: +0 / spray: +4000 / set: +25800
> > > > >  
> > > > >   - ### 4-5. 리뷰 시스템 CSS (END ORDO CSS 바로 위)
> > > > >  
> > > > >   - ```css
> > > > >     /* ec-base-table 카드형 변환 */
> > > > >     .xans-product-review .ec-base-table { display: block !important; width: 100% !important; }
> > > > >     .xans-product-review .ec-base-table thead { display: none !important; }
> > > > >     .xans-product-review .ec-base-table tbody { display: block !important; width: 100% !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- { display: grid !important; width: 100% !important; grid-template-columns: auto auto auto 1fr !important; grid-template-rows: auto auto !important; column-gap: 6px !important; row-gap: 4px !important; padding: 20px 16px !important; border-bottom: 1px solid #eee !important; box-sizing: border-box !important; align-items: center !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- td.RW { display: none !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- td:nth-child(6) { grid-column: 1 / 2 !important; grid-row: 1 / 2 !important; display: flex !important; align-items: center !important; padding: 0 !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- td:nth-child(3) { grid-column: 2 / 3 !important; grid-row: 1 / 2 !important; font-size: 14px !important; font-weight: 700 !important; color: #222 !important; text-align: left !important; padding: 0 !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- td:nth-child(4) { grid-column: 3 / 4 !important; grid-row: 1 / 2 !important; font-size: 12px !important; color: #999 !important; text-align: left !important; padding: 0 !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- td:nth-child(5) { display: none !important; }
> > > > >     .xans-product-review .ec-base-table tbody tr.xans-record- td.subject { grid-column: 1 / 5 !important; grid-row: 2 / 3 !important; font-size: 14px !important; color: #333 !important; text-align: left !important; padding: 6px 0 0 !important; }
> > > > >     ```
> > > > >
> > > > > ### 4-6. 리뷰 시스템 JS
> > > > >
> > > > > ```javascript
> > > > > // 후기 작성 버튼 visibility 강제 복원
> > > > > var showReviewWrite = function() {
> > > > >   var b = document.querySelector('.ordo-review-write');
> > > > >   if(b) { b.removeAttribute('style'); b.style.setProperty('visibility','visible','important'); }
> > > > > };
> > > > > showReviewWrite(); setTimeout(showReviewWrite, 100); setTimeout(showReviewWrite, 500);
> > > > >
> > > > > // 후기 목록 표시 강제 복원 + tbody 너비 강제 설정
> > > > > var showReviews = function() {
> > > > >   var t = document.querySelector('.xans-product-review .ec-base-table');
> > > > >   if(t) {
> > > > >     t.style.removeProperty('display');
> > > > >     t.style.setProperty('display','block','important');
> > > > >     var tb = t.querySelector('tbody');
> > > > >     if(tb) {
> > > > >       var w = t.offsetWidth || t.parentElement.offsetWidth;
> > > > >       if(w > 0) tb.style.setProperty('width', w + 'px', 'important');
> > > > >     }
> > > > >   }
> > > > > };
> > > > > showReviews(); setTimeout(showReviews, 300); setTimeout(showReviews, 800); setTimeout(showReviews, 1500);
> > > > > ```
> > > > >
> > > > > ---
> > > > >
> > > > > ## 5. order/basket.html
> > > > >
> > > > > "주문 확인" 페이지로 커스텀 변환된 파일.
> > > > >
> > > > > ### 5-1. 첫 번째 style 블록 핵심
> > > > >
> > > > > ```css
> > > > > /* X버튼(btnDelete) 숨김 — 수량 옆 "삭제" 버튼만 사용 */
> > > > > .btnDelete { display: none !important; }
> > > > >
> > > > > /* 수량 영역 표시 */
> > > > > .prdBox .quantity { display: flex !important; align-items: center !important; }
> > > > > ```
> > > > >
> > > > > ### 5-2. ordoBasketInit() 함수 (두 번째 script 블록)
> > > > >
> > > > > ```javascript
> > > > > function ordoBasketInit() {
> > > > >   // ① 결제하기 버튼 텍스트 수정
> > > > >   document.querySelectorAll('a.btnSubmit.gFull.sizeL').forEach(function(btn) {
> > > > >     if (btn.textContent.trim() !== '결제하기') {
> > > > >       btn.textContent = '결제하기';
> > > > >     }
> > > > >   });
> > > > >
> > > > >   // ② 변경 버튼 → 삭제 버튼 (Basket.deleteBasketItem 직접 호출)
> > > > >   document.querySelectorAll('a.btnNormal.sizeQty').forEach(function(btn, index) {
> > > > >     if (btn.textContent.trim() === '변경') {
> > > > >       btn.textContent = '삭제';
> > > > >       btn.setAttribute('onclick', 'Basket.deleteBasketItem(' + index + ');return false;');
> > > > >     }
> > > > >   });
> > > > >
> > > > >   // ③ breadcrumb 텍스트 변경
> > > > >   document.querySelectorAll('li').forEach(function(el) {
> > > > >     if (el.textContent.trim() === '장바구니') {
> > > > >       el.textContent = '주문 확인';
> > > > >     }
> > > > >   });
> > > > >
> > > > >   // ④ h3 타이틀 변경
> > > > >   document.querySelectorAll('h3').forEach(function(el) {
> > > > >     if (el.textContent.trim() === '장바구니') {
> > > > >       el.textContent = '주문 확인';
> > > > >     }
> > > > >   });
> > > > > }
> > > > > // DOMContentLoaded + load + setTimeout 으로 여러 번 실행 (카페24 동적 렌더링 대응)
> > > > > document.addEventListener('DOMContentLoaded', function() {
> > > > >   ordoBasketInit();
> > > > >   setTimeout(ordoBasketInit, 300);
> > > > >   setTimeout(ordoBasketInit, 800);
> > > > >   setTimeout(ordoBasketInit, 1500);
> > > > > });
> > > > > window.addEventListener('load', function() {
> > > > >   ordoBasketInit();
> > > > >   setTimeout(ordoBasketInit, 500);
> > > > > });
> > > > > ```
> > > > >
> > > > > > ⚠️ 이 함수 수정 시 반드시 블록 전체를 한 번에 교체. 부분 수정 시 구문 오류 발생 이력 있음.
> > > > > >
> > > > > > ### 5-3. 미해결: 수량 버튼 (-/+) 스타일
> > > > > >
> > > > > > - **목표:** 바텀시트 버튼과 동일 → `26×26px`, `border: 1px solid #ddd`, `border-radius: 50%`, `font-size: 16px`
> > > > > > - - **문제:** 카페24 기본 CSS에서 `a.up`, `a.down`에 `position: absolute` 적용 → `::after` 가 1px로 잘림
> > > > > >   - - **다음 시도 제안:** JS로 버튼 innerHTML을 직접 `<span>+</span>` / `<span>-</span>` 으로 교체
> > > > > >    
> > > > > >     - ---
> > > > > >
> > > > > > ## 6. 카페24 시스템 CSS 제약 (필수 숙지)
> > > > > >
> > > > > > ### 후기 작성 버튼 숨김 문제
> > > > > > 카페24가 자동 적용:
> > > > > > ```css
> > > > > > [href*="write.html"][href*="board_no=4"] { visibility: hidden; } /* specificity: (0,2,0) */
> > > > > > ```
> > > > > > 해결: `a.ordo-review-write[href]` — specificity (0,2,1)로 덮어써야 함
> > > > > > 또한 카페24가 `<a>` 태그에 `style="display:none"` 인라인 추가 → JS로 `removeAttribute('style')` 필요
> > > > > >
> > > > > > ### breview가 ec-base-table을 숨기는 문제
> > > > > > 카페24 스크립트가 비동기로 `ec-base-table`에 `class="breview-hide"` + `style="display:none"` 강제 적용
> > > > > > → `showReviews()` 즉시 + 300ms + 800ms + 1500ms 총 4회 실행
> > > > > >
> > > > > > ### tbody 너비 문제
> > > > > > `table`을 `display:block`으로 바꿔도 `tbody`의 `width:100%`가 작동 안 함
> > > > > > → JS로 `table.offsetWidth`를 직접 읽어 `tbody`에 px 값으로 설정
> > > > > >
> > > > > > ### 관리자 환경 API 테스트 주의
> > > > > > 관리자 로그인 상태에서 `/exec/front/order/basket/` 호출 시 `result:-999` 반환 → 정상 (관리자 환경 특성)
> > > > > > 실제 비회원 환경(시크릿 창)에서만 테스트
> > > > > >
> > > > > > ---
> > > > > >
> > > > > > ## 7. 이중 리뷰 시스템 구조
> > > > > >
> > > > > > | 구분 | 요소 | 역할 | 접근 가능 여부 |
> > > > > > |------|------|------|--------------|
> > > > > > | ① breview 위젯 | #breview-panel-iframe | 카드형 UI, 스태프 리뷰 표시 | ❌ cross-origin iframe — 직접 수정 불가 |
> > > > > > | ② ec-base-table | .xans-product-review .ec-base-table | 테이블형 기본 리뷰 목록 | ✅ 수정 가능 |
> > > > > >
> > > > > > ### ec-base-table TD 구조 (순서 혼동 주의)
> > > > > >
> > > > > > | td 순서 | className | 내용 | CSS grid 배치 |
> > > > > > |---------|-----------|------|--------------|
> > > > > > | td:nth-child(1) | RW | 번호 | 숨김 |
> > > > > > | td:nth-child(2) | subject left txtBreak | 제목(리뷰 내용) — a링크 포함 | grid-row 2, col 1/5 |
> > > > > > | td:nth-child(3) | (없음) | 작성자명 | grid-row 1, col 2 |
> > > > > > | td:nth-child(4) | (없음) | 작성일 | grid-row 1, col 3 |
> > > > > > | td:nth-child(5) | (없음) | 조회수 | 숨김 |
> > > > > > | td:nth-child(6) | (없음) | 별점 이미지 | grid-row 1, col 1 |
> > > > > >
> > > > > > > ⚠️ 별점이 6번째지만 CSS grid로 첫 번째 열에 배치. 변경 시 실제 DOM에서 재확인.
> > > > > > >
> > > > > > > ---
> > > > > > >
> > > > > > > ## 8. 에디터 작업 방법
> > > > > > >
> > > > > > > ### CodeMirror API
> > > > > > >
> > > > > > > ```javascript
> > > > > > > var editors = document.querySelectorAll('.CodeMirror');
> > > > > > > // editors[0]: 작은 파일 / editors[1]: detail.html (약 69,000자)
> > > > > > > var cm = editors[1].CodeMirror;
> > > > > > >
> > > > > > > // 줄 읽기 (index 0부터 시작, 표시 줄번호는 1부터)
> > > > > > > cm.getLine(1065); // 1066번 줄
> > > > > > >
> > > > > > > // 줄 교체
> > > > > > > cm.replaceRange(새내용, {line: 1065, ch: 0}, {line: 1065, ch: 기존줄.length});
> > > > > > > ```
> > > > > > >
> > > > > > > ### CodeMirror 읽기 차단 문제
> > > > > > > `cm.getValue()` 호출 시 `[BLOCKED: Cookie/query string data]` 에러 자주 발생
> > > > > > > → `.indexOf(키워드)`로 위치만 확인 후 `getLine(index)`로 개별 줄 읽기
> > > > > > >
> > > > > > > ---
> > > > > > >
> > > > > > > ## 9. AI가 범하기 쉬운 실수 패턴
> > > > > > >
> > > > > > > | # | 실수 | 해결책 |
> > > > > > > |---|------|--------|
> > > > > > > | 1 | 지시하지 않은 파일 수정 (orderform.html 등) | 작업 전 "이 파일 수정 지시가 있었나?" 스스로 확인 |
> > > > > > > | 2 | showReviews 함수 정의만 하고 호출 코드 누락 | 함수 정의 후 반드시 실행 코드 함께 작성 |
> > > > > > > | 3 | tbody 너비 CSS만으로 해결 시도 | CSS 불가 → JS setProperty('width', px값) 방식 사용 |
> > > > > > > | 4 | table.offsetWidth가 0일 때 대비 미흡 | `var w = t.offsetWidth \|\| t.parentElement.offsetWidth; if(w > 0)` |
> > > > > > > | 5 | setTimeout 횟수 부족 | 즉시 + 300ms + 800ms + 1500ms 총 4회 |
> > > > > > > | 6 | CSS specificity 오판 | `.ordo-review-write` (0,1,0)은 카페24 (0,2,0)을 못 이김 → `a.ordo-review-write[href]` (0,2,1) 사용 |
> > > > > > > | 7 | 코드 부분 교체 시 잔재 남김 | 블록 전체를 한 번에 교체 |
> > > > > > > | 8 | 관리자 환경에서 API 테스트 | 시크릿 창(비회원 환경)에서 테스트 |
> > > > > > > | 9 | 에디터에 index.html이 열려 있음 | 작업 전 항상 detail.html 탭인지 확인 |
> > > > > > > | 10 | td nth-child 순서 혼동 | 실제 DOM에서 `querySelectorAll('td')`로 재확인 |
> > > > > > >
> > > > > > > ---
> > > > > > >
> > > > > > > ## 10. 완료 이력
> > > > > > >
> > > > > > > | 날짜 | 문제 | 해결 방법 |
> > > > > > > |------|------|-----------|
> > > > > > > | 2026-06 | 카페24 기본 옵션/수량/TOTAL/버튼 영역이 보임 | USER DEFINED style에 6줄 CSS 추가 |
> > > > > > > | 2026-06 | 구매하기 → "입력하신 정보가 올바르지 않습니다" | basket API params 전체 재작성 |
> > > > > > > | 2026-06 | basket.html X버튼 보임 | `.btnDelete { display: none !important; }` |
> > > > > > > | 2026-06 | basket.html "변경" 버튼 삭제 안 됨 | `Basket.deleteBasketItem(index)` 직접 호출 |
> > > > > > > | 2026-06 | 후기 작성 버튼 안 보임 | a.ordo-review-write[href] + JS 4회 실행 |
> > > > > > > | 2026-06 | 후기 목록 안 보임 | showReviews() JS로 강제 표시 |
> > > > > > > | 2026-06 | 리뷰 카드형 UI | CSS grid로 breview 카드 형식과 유사하게 변환 |
> > > > > > >
> > > > > > > ---
> > > > > > >
> > > > > > > ## 11. 다음 세션 시작 체크리스트
> > > > > > >
> > > > > > > 1. `tabs_context`로 현재 탭 목록 확인
> > > > > > > 2. 2. 에디터 탭에서 **detail.html** 탭이 선택되어 있는지 확인 (index.html 아닌지)
> > > > > > >    3. 3. 실제 상품 페이지(product_no=11) 새로고침 후 현재 상태 스크린샷 확인
> > > > > > >       4. 4. 사용자 요청이 지시한 파일 내 작업인지 먼저 확인
> > > > > > >          5. 5. 수정 전 관련 줄 번호를 키워드 검색으로 재확인 (줄 번호 변동됨)
> > > > > > >             6. 6. 수정 → 저장 → 라이브 페이지 새로고침(5초 대기) → DOM 확인 → 스크린샷 순서 준수
> > > > > > >                7. 
