/* ordo-landing.js v313 - self-versioning */
(function(){
  var CURRENT_VER = 313;
  var scripts = document.querySelectorAll('script[src*="ordo-landing.js"]');
  for(var i=0; i<scripts.length; i++){
    var src = scripts[i].src;
    if(src.indexOf('v='+CURRENT_VER) === -1){
      var newSrc = src.split('?')[0] + '?v=' + CURRENT_VER;
      var s = document.createElement('script');
      s.src = newSrc;
      document.head.appendChild(s);
      return;
    }
  }
})();
(function(){
  var style = document.createElement('style');
  style.textContent = '#review,.s13-section{display:none!important}'
    + '.xans-product-headcategory{display:none!important}'
    + '.xans-product-detail{padding:0!important;padding-top:0!important}'
    + '.xans-product-detail.section{padding:0!important;padding-top:0!important}'
    + '.xans-product-detail .imgArea{width:100vw!important;position:relative!important;left:50%!important;transform:translateX(-50%)!important;margin:0!important;margin-top:0!important;padding:0!important;overflow:hidden!important;display:block!important}'
    + '.xans-product-detail .imgArea img{width:100%!important;max-width:100%!important;display:block!important}'
    + '#ordo-kakao-btn{position:fixed;bottom:80px;right:12px;z-index:9999;background:#FEE500;border:none;border-radius:50px;padding:10px 16px;display:flex;align-items:center;gap:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.18);font-size:13px;font-weight:700;color:#191919;line-height:1;white-space:nowrap}'
    + '#ordo-kakao-btn svg{width:20px;height:20px;flex-shrink:0}';
  (document.head || document.documentElement).appendChild(style);
})();

// S6 4단계 순차 애니메이션 (원 + 연결 라인 함께)
(function(){
  var glows = document.querySelectorAll('.s6-glow-ring');
  var rings = document.querySelectorAll('.s6-active-ring');
  var arcs = document.querySelectorAll('.s6-arc-active');
  if(!glows.length) return;
  var current = 0;
  var nodes = [1, 2, 3, 4];
  // arc 연결: 단계 n에서 n→n+1 라인 활성 (arc data-arc="n")
  function stepCircle() {
    var activeNode = nodes[current];
    // 원 glow
    glows.forEach(function(g) {
      var node = parseInt(g.getAttribute('data-node'));
      g.style.transition = 'opacity 0.5s ease';
      g.style.opacity = (node === activeNode) ? '1' : '0';
    });
    // 원 테두리
    rings.forEach(function(r) {
      var node = parseInt(r.getAttribute('data-node'));
      r.style.transition = 'opacity 0.5s ease';
      r.style.opacity = (node === activeNode) ? '1' : '0';
    });
    // 연결 라인: 활성 원에서 나가는 라인 (activeNode→activeNode%4+1)
    arcs.forEach(function(a) {
      var arc = parseInt(a.getAttribute('data-arc'));
      a.style.transition = 'opacity 0.5s ease';
      a.style.opacity = (arc === activeNode) ? '1' : '0';
    });
    current = (current + 1) % nodes.length;
    setTimeout(stepCircle, 1000);
  }
  stepCircle();
})();;

(function(){
  var track = document.querySelector('.s2-slider-track');
  if(!track) return;
  var speed = 1.5; // px per frame
  var offset = 0;
  
  // 트랙의 실제 너비의 절반(복제본이 있으므로)
  function getHalfWidth() {
    return track.scrollWidth / 2;
  }
  
  function tick() {
    offset += speed;
    var half = getHalfWidth();
    if(offset >= half) offset -= half;
    track.style.transform = 'translateX(-' + offset + 'px)';
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
})();

// S3 정사각형 이미지 슬라이드인 - rAF 폴링 방식
(function(){
  var container = document.querySelector('.s3-sq-wrap');
  var imgWrap = document.querySelector('.s3-sq-img-wrap');
  var txtWrap = document.querySelector('.s3-sq-text');
  if(!container || !imgWrap) return;
  var done = false;
  function checkLoop() {
    if(done) return;
    var rect = container.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      imgWrap.classList.add('in-view');
      if(txtWrap) txtWrap.classList.add('in-view');
      done = true;
      return;
    }
    requestAnimationFrame(checkLoop);
  }
  requestAnimationFrame(checkLoop);
})();
// S3 두 번째 블록 (오른쪽→왼쪽) rAF 폴링
(function(){
  var container2 = document.querySelector('.s3-sq-wrap2');
      if(container2) container2.style.position = 'relative';
  var imgWrap2 = document.querySelector('.s3-sq-img-wrap2');
  var txtWrap2 = document.querySelector('.s3-sq-text2');
  if(!container2 || !imgWrap2) return;
  var done2 = false;
  function checkLoop2() {
    if(done2) return;
    var rect = container2.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      imgWrap2.classList.add('in-view2');
      if(txtWrap2) txtWrap2.classList.add('in-view2');
      done2 = true;
      return;
    }
    requestAnimationFrame(checkLoop2);
  }
  requestAnimationFrame(checkLoop2);
})();


  // S7/S8 순차 박스 강조 애니메이션
(function(){
  function animateScrubWords(words) {
    if (!words || words.length === 0) return;
    let idx = 0;
    function next() {
      words.forEach(w => w.classList.remove('active'));
      words[idx].classList.add('active');
      idx = (idx + 1) % words.length;
      setTimeout(next, 800);
    }
    next();
  }
  
  // S7 scrub words
  var sw = document.querySelectorAll('.s7-sw1, .s7-sw2, .s7-sw3');
  if (sw.length > 0) {
    var groups = {};
    sw.forEach(function(w) {
      var p = w.parentElement;
      if (!groups.has) {
        groups = [];
      }
      // 같은 부모 그룹별로 처리
    });
    // 모든 s7-scrub-word 그룹 찾기
    var wraps = document.querySelectorAll('.s7-scrub-anim-wrap');
    wraps.forEach(function(wrap) {
      var words = wrap.querySelectorAll('.s7-scrub-word');
      if (words.length > 0) animateScrubWords(Array.from(words));
    });
  }
})();

// S8 bar chart 스크롤 애니메이션 (S9와 동일한 방식)
(function(){
  var bars = document.querySelectorAll('.s8-bar-fill[data-width]');
  if(!bars.length) return;
  var animated = false;
  function checkBars() {
    if(animated) return;
    var section = document.querySelector('.s8-stats-wrap');
    if(!section) return;
    var rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.9) {
      animated = true;
      bars.forEach(function(bar, i) {
        setTimeout(function() {
          bar.style.transition = 'width 1.2s ease';
          bar.style.width = bar.getAttribute('data-width');
        }, i * 150);
      });
    }
  }
  window.addEventListener('scroll', checkBars, {passive:true});
  checkBars();
})();


// S10 SVG 차트 애니메이션
(function(){
  // 라인 차트 (좌→우 드로우)
  function initLineChart() {
    var line = document.querySelector('.s10-line-dermosoft');
    if(!line) return;
    var len = line.getTotalLength ? line.getTotalLength() : 200;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.transition = 'none';
    var done = false;
    function check() {
      if(done) return;
      var el = line.closest('.s10-svg-chart1') || line;
      var rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.9) {
        done = true;
        line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)';
        line.style.strokeDashoffset = '0';
      }
    }
    window.addEventListener('scroll', check, {passive:true});
    check();
  }
  
  // 막대 차트 (0% 기준선에서 아래로 성장, rAF 수동 스텝)
  function initBarChart() {
    var barA = document.querySelector('.s10-bar2-a');
    var barB = document.querySelector('.s10-bar2-b');
    var labelA = document.querySelector('.s10-bar2-label-a');
    var labelB = document.querySelector('.s10-bar2-label-b');
    if(!barA || !barB) return;
    var done = false;
    function animateH(el, targetH, duration, onDone) {
      var start = null;
      function step(ts) {
        if(!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        el.setAttribute('height', (e * targetH).toFixed(1));
        if(p < 1) { requestAnimationFrame(step); } else { if(onDone) onDone(); }
      }
      requestAnimationFrame(step);
    }
    function check() {
      if(done) return;
      var el = barA.closest('.s10-svg-chart2') || barA;
      var rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.9) {
        done = true;
        animateH(barA, 27, 1200, function() {
          if(labelA) { labelA.style.transition = 'opacity 0.4s ease'; labelA.setAttribute('opacity','1'); }
        });
        setTimeout(function() {
          animateH(barB, 81, 1200, function() {
            if(labelB) { labelB.style.transition = 'opacity 0.4s ease'; labelB.setAttribute('opacity','1'); }
          });
        }, 300);
      }
    }
    window.addEventListener('scroll', check, {passive:true});
    check();
  }
  
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initLineChart(); initBarChart(); });
  } else {
    initLineChart();
    initBarChart();
  }
})();


// S9 막대 그래프 스크롤 애니메이션
(function(){
  var bars9 = document.querySelectorAll('.s9-bar-fill[data-width]');
  if(!bars9.length) return;
  var animated9 = false;
  function checkBars9() {
    if(animated9) return;
    var section = document.querySelector('.s9-stats-wrap');
    if(!section) return;
    var rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.9) {
      animated9 = true;
      bars9.forEach(function(bar, i) {
        setTimeout(function() {
          bar.style.transition = 'width 1.2s ease';
          bar.style.width = bar.getAttribute('data-width');
        }, i * 150);
      });
    }
  }
  window.addEventListener('scroll', checkBars9, {passive:true});
  checkBars9();
})();


// S1 카드 텍스트 깜빡 애니메이션 (IntersectionObserver, 2번, 텍스트만)
(function(){
  var cards = document.querySelectorAll('.s1-card');
  if(!cards.length) return;

  function blinkCardText(card) {
    var content = card.querySelector('.s1-card-content');
    if(!content) return;
    var count = 0;
    var total = 4; // 2번 깜빡 = on/off × 2
    var interval = setInterval(function() {
      content.style.opacity = (count % 2 === 0) ? '0.1' : '1';
      count++;
      if(count >= total) {
        clearInterval(interval);
        content.style.opacity = '1';
      }
    }, 120);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting) {
        observer.unobserve(entry.target);
        blinkCardText(entry.target);
      }
    });
  }, {threshold: 0.5});

  cards.forEach(function(card) {
    observer.observe(card);
  });
})();

// S4 텍스트 순차 페이드인 (IntersectionObserver)
(function(){
  var s4overlay = document.getElementById('s4Overlay');
  if(!s4overlay) return;
  var fadeItems = s4overlay.querySelectorAll('.s4-fade-item');
  if(!fadeItems.length) return;
  var triggered = false;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting && !triggered) {
        triggered = true;
        observer.disconnect();
        fadeItems.forEach(function(item, i) {
          setTimeout(function() {
            item.classList.add('s4-visible');
          }, i * 320);
        });
      }
    });
  }, {threshold: 0.25});
  observer.observe(s4overlay);
})();

            
// ===== 영상 스크롤 진입 재생 (video 태그) =====
(function(){
  var videoObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        v.play().catch(function(){});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, {threshold: 0.3});
  
  function observeVideos() {
    document.querySelectorAll('video[autoplay]').forEach(function(v) {
      videoObs.observe(v);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeVideos);
  } else {
    observeVideos();
  }
})();



// 영상 재생속도 제어
document.addEventListener('DOMContentLoaded', function() {
  const poreVideo = doc
(function(){
})();

(function(){
  var PRODUCT_INFO_HTML = '<table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.6">'
    + '<colgroup><col style="width:35%"><col style="width:65%"></colgroup>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">품명 및 모델명</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">오르도 레이어 어반 스트레스 쉰드 바디워시</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">용량</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">400ml</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">제품 주요사항</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">모든 피부용</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">사용기한</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">개끵 전 36개월, 개끵 후 12개월</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">사용방법</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">적당량을 취해 피부에 사용한 후 물로 깨끗이 씨어냅니다.</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">화장품제조업자</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">제품별도표기</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">화장품체임판매업자</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">제품별도표기</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">제조국</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">대한민국</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">기능성화장품 심사 유무</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">해당없음</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">소비자상담 전화번호</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">1:1 문의 접수</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">품질보증기준</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top">본 제품에 이상이 있을 경우 공정거래위원회 고시 소비자분쟁해결 기준에 의해 보상해드립니다.</td></tr>'
    + '<tr><td style="padding:10px 8px;border-bottom:1px solid #eee;color:#888;vertical-align:top">전성분</td><td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top;word-break:break-all">정제수, 글리세린, 나이아신아마이드, 코카미도프로필베타인, 소듘C14-16올레핀설포네이트, 아크릴레이트코폴리머, 라우릴글루코사이드, 소듘클로라이드, 다이소듘코코암포다이아세테이트, 베타인, 향료, 판테놀, 1,2-헥산다이올, 살리실릭애씨, 하이드록시아세토페놌, 부틸렌글라이콜, 소듘하이드록사이드, 알란토인, 시트릭애씨, 다이소듘이디티에이, 에틸헥슬글리세린, 헥실렌글라이콜, 삼나무잎추출물, 연꽃잎추출물, 효모발효물, 맥아추출물, 글루코노락톤, 황련듵리추출물, 라벤더꽃추출물, 편백잎추출물, 콘미트잎추출물, 드럼스틱씨추출물, 잏나무숨추출물, 구주소나무솔방울추출물, 로즈마리잎추출물, 타임잎추출물, 애플민트잎추출물, 스피어미트잎추출물, 밤부사불가리스추출물, 소나무잎추출물, 측백나무추출물</td></tr>'
    + '<tr><td style="padding:10px 8px;color:#888;vertical-align:top">사용할 때 주의사항</td><td style="padding:10px 8px;vertical-align:top">'
    + '<ol style="margin:0;padding-left:16px;line-height:1.8">'
    + '<li>화장품 사용 시 또는 사용 후 직사광선에 의하여 사용부위가 붉은 반점, 부어오름 또는 가려움증 등의 이상 증상이나 부작용이 있는 경우 전문의 등과 상담할 것</li>'
    + '<li>상잘가 있는 부위 등에는 사용을 자제할 것</li>'
    + '<li>보관 및 취급 시의 주의사항: (①) 어린이의 손이 닿지 않는 곳에 보관할 것 (②) 직사광선을 피해서 보관할 것</li>'
    + '<li>눈에 들어갔을 때에는 물로 씨어내고, 이상이 있는 경우에는 전문의 등과 상담할 것</li>'
    + '<li>만 3세 이하 어린이에게는 사용하지 말 것</li>'
    + '<li>대량을 광범위한 부위에 적용하거나 장기간 사용하는 경우 부작용이 나타나기 쉽으므로 주의해서 사용할 것</li>'
    + '<li>살리실산에 과민증이 있거나 당놨병, 혁액순환장애 등의 직환이 있는 분은 사용 전 의사도우미와 상담할 것</li>'
    + '</ol>'
    + '<p style="margin:8px 0 0;color:#888;font-size:12px">사용 전에 반드시 사용법 및 사용 시의 주의사항을 숙지하신 후 사용하십시오.</p>'
    + '</td></tr>'
    + '</table>';

  function setupFolds(){
    // review 숨김 유지
    var review = document.getElementById('review');
    if(review) review.style.display = 'none';

    // s13-section 숨기기
    document.querySelectorAll('.s13-section').forEach(function(el){
      el.style.display = 'none';
    });

    // pay_Info 표시 보장
    var pay = document.getElementById('pay_Info');
    if(pay) pay.style.display = '';

    // service_Info -> 상품 정보 제공 고시
    var svc = document.getElementById('service_Info');
    if(svc && !svc.dataset.replaced){
      var titleEl = svc.querySelector('.info_title');
      var contentEl = svc.querySelector('.info_content');
      if(titleEl) titleEl.innerHTML = '상품 정보 제공 고시<i aria-hidden="true" class="icon icoPlus">+</i>';
      if(contentEl){ contentEl.innerHTML = PRODUCT_INFO_HTML; contentEl.style.padding = '0'; }
      svc.dataset.replaced = '1';
    }

    // QnA -> 문의사항
    var qna = document.getElementById('QnA');
    if(qna){
      qna.style.removeProperty('display');
      var qnaTitle = qna.querySelector('.info_title');
      if(qnaTitle && !qna.dataset.retitled){
        qnaTitle.innerHTML = '문의사항<i aria-hidden="true" class="icon icoPlus">+</i>';
        qna.dataset.retitled = '1';
      }
    }

    // 순서 재배치: 1.상품정보고시 2.상품결제정보 3.배송안내 4.교환반품 5.문의사항
    var svcEl = document.getElementById('service_Info');
    var parent = svcEl && svcEl.parentElement;

    // 카카오 1초 로그인 버튼
    if(!document.getElementById('ordo-kakao-btn')){
      var btn = document.createElement('a');
      btn.id = 'ordo-kakao-btn';
      btn.href = '/member/login.html';
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.7 1.74 5.07 4.35 6.42L6.3 20.1c-.09.27.18.51.42.36l4.08-2.73c.39.06.78.09 1.2.09 4.97 0 9-3.36 9-7.5S16.97 3 12 3z" fill="#191919"/></svg>1초 로그인';
      document.body.appendChild(btn);
    }
    if(!parent || parent.dataset.reordered) return;
    var order = ['service_Info','pay_Info','delivery_Info','exchange_Info','QnA'];
    var allPresent = order.every(function(id){ return !!document.getElementById(id); });
    if(!allPresent) return;
    var frag = document.createDocumentFragment();
    order.forEach(function(id){
      frag.appendChild(document.getElementById(id));
    });
    if(review) frag.appendChild(review);
    parent.appendChild(frag);
    parent.dataset.reordered = '1';
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupFolds);
  } else {
    setupFolds();
  }
  var obs = new MutationObserver(function(){
    if(!document.body.dataset.foldsReady) setupFolds();
  });
  obs.observe(document.body, {childList:true, subtree:true});
  setTimeout(setupFolds, 300);
  setTimeout(setupFolds, 1000);
})();


// ===== cafe24-detail.html 애니메이션 (카페24 script 제거 우회) =====
(function initDetailAnimations(){
  function run(){
    if(!document.querySelector('.s1-hero, .s6-glow-ring, .s2-slider-track')) return;
    // S6 4단계 순차 애니메이션 (원 + 연결 라인 함께)
(function(){
  var glows = document.querySelectorAll('.s6-glow-ring');
  var rings = document.querySelectorAll('.s6-active-ring');
  var arcs = document.querySelectorAll('.s6-arc-active');
  if(!glows.length) return;
  var current = 0;
  var nodes = [1, 2, 3, 4];
  // arc 연결: 단계 n에서 n→n+1 라인 활성 (arc data-arc="n")
  function stepCircle() {
    var activeNode = nodes[current];
    // 원 glow
    glows.forEach(function(g) {
      var node = parseInt(g.getAttribute('data-node'));
      g.style.transition = 'opacity 0.5s ease';
      g.style.opacity = (node === activeNode) ? '1' : '0';
    });
    // 원 테두리
    rings.forEach(function(r) {
      var node = parseInt(r.getAttribute('data-node'));
      r.style.transition = 'opacity 0.5s ease';
      r.style.opacity = (node === activeNode) ? '1' : '0';
    });
    // 연결 라인: 활성 원에서 나가는 라인 (activeNode→activeNode%4+1)
    arcs.forEach(function(a) {
      var arc = parseInt(a.getAttribute('data-arc'));
      a.style.transition = 'opacity 0.5s ease';
      a.style.opacity = (arc === activeNode) ? '1' : '0';
    });
    current = (current + 1) % nodes.length;
    setTimeout(stepCircle, 1000);
  }
  stepCircle();
})();;

(function(){
  var track = document.querySelector('.s2-slider-track');
  if(!track) return;
  var speed = 1.5; // px per frame
  var offset = 0;
  
  // 트랙의 실제 너비의 절반(복제본이 있으므로)
  function getHalfWidth() {
    return track.scrollWidth / 2;
  }
  
  function tick() {
    offset += speed;
    var half = getHalfWidth();
    if(offset >= half) offset -= half;
    track.style.transform = 'translateX(-' + offset + 'px)';
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
})();

// S3 정사각형 이미지 슬라이드인 - rAF 폴링 방식
(function(){
  var container = document.querySelector('.s3-sq-wrap');
  var imgWrap = document.querySelector('.s3-sq-img-wrap');
  var txtWrap = document.querySelector('.s3-sq-text');
  if(!container || !imgWrap) return;
  var done = false;
  function checkLoop() {
    if(done) return;
    var rect = container.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      imgWrap.classList.add('in-view');
      if(txtWrap) txtWrap.classList.add('in-view');
      done = true;
      return;
    }
    requestAnimationFrame(checkLoop);
  }
  requestAnimationFrame(checkLoop);
})();
// S3 두 번째 블록 (오른쪽→왼쪽) rAF 폴링
(function(){
  var container2 = document.querySelector('.s3-sq-wrap2');
      if(container2) container2.style.position = 'relative';
  var imgWrap2 = document.querySelector('.s3-sq-img-wrap2');
  var txtWrap2 = document.querySelector('.s3-sq-text2');
  if(!container2 || !imgWrap2) return;
  var done2 = false;
  function checkLoop2() {
    if(done2) return;
    var rect = container2.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      imgWrap2.classList.add('in-view2');
      if(txtWrap2) txtWrap2.classList.add('in-view2');
      done2 = true;
      return;
    }
    requestAnimationFrame(checkLoop2);
  }
  requestAnimationFrame(checkLoop2);
})();
    // S7/S8 순차 박스 강조 애니메이션
(function(){
  function animateScrubWords(words) {
    if (!words || words.length === 0) return;
    let idx = 0;
    function next() {
      words.forEach(w => w.classList.remove('active'));
      words[idx].classList.add('active');
      idx = (idx + 1) % words.length;
      setTimeout(next, 800);
    }
    next();
  }
  
  // S7 scrub words
  var sw = document.querySelectorAll('.s7-sw1, .s7-sw2, .s7-sw3');
  if (sw.length > 0) {
    var groups = {};
    sw.forEach(function(w) {
      var p = w.parentElement;
      if (!groups.has) {
        groups = [];
      }
      // 같은 부모 그룹별로 처리
    });
    // 모든 s7-scrub-word 그룹 찾기
    var wraps = document.querySelectorAll('.s7-scrub-anim-wrap');
    wraps.forEach(function(wrap) {
      var words = wrap.querySelectorAll('.s7-scrub-word');
      if (words.length > 0) animateScrubWords(Array.from(words));
    });
  }
})();

// S8 bar chart 스크롤 애니메이션 (S9와 동일한 방식)
(function(){
  var bars = document.querySelectorAll('.s8-bar-fill[data-width]');
  if(!bars.length) return;
  var animated = false;
  function checkBars() {
    if(animated) return;
    var section = document.querySelector('.s8-stats-wrap');
    if(!section) return;
    var rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.9) {
      animated = true;
      bars.forEach(function(bar, i) {
        setTimeout(function() {
          bar.style.transition = 'width 1.2s ease';
          bar.style.width = bar.getAttribute('data-width');
        }, i * 150);
      });
    }
  }
  window.addEventListener('scroll', checkBars, {passive:true});
  checkBars();
})();


// S10 SVG 차트 애니메이션
(function(){
  // 라인 차트 (좌→우 드로우)
  function initLineChart() {
    var line = document.querySelector('.s10-line-dermosoft');
    if(!line) return;
    var len = line.getTotalLength ? line.getTotalLength() : 200;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.transition = 'none';
    var done = false;
    function check() {
      if(done) return;
      var el = line.closest('.s10-svg-chart1') || line;
      var rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.9) {
        done = true;
        line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)';
        line.style.strokeDashoffset = '0';
      }
    }
    window.addEventListener('scroll', check, {passive:true});
    check();
  }
  
  // 막대 차트 (0% 기준선에서 아래로 성장, rAF 수동 스텝)
  function initBarChart() {
    var barA = document.querySelector('.s10-bar2-a');
    var barB = document.querySelector('.s10-bar2-b');
    var labelA = document.querySelector('.s10-bar2-label-a');
    var labelB = document.querySelector('.s10-bar2-label-b');
    if(!barA || !barB) return;
    var done = false;
    function animateH(el, targetH, duration, onDone) {
      var start = null;
      function step(ts) {
        if(!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        el.setAttribute('height', (e * targetH).toFixed(1));
        if(p < 1) { requestAnimationFrame(step); } else { if(onDone) onDone(); }
      }
      requestAnimationFrame(step);
    }
    function check() {
      if(done) return;
      var el = barA.closest('.s10-svg-chart2') || barA;
      var rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.9) {
        done = true;
        animateH(barA, 27, 1200, function() {
          if(labelA) { labelA.style.transition = 'opacity 0.4s ease'; labelA.setAttribute('opacity','1'); }
        });
        setTimeout(function() {
          animateH(barB, 81, 1200, function() {
            if(labelB) { labelB.style.transition = 'opacity 0.4s ease'; labelB.setAttribute('opacity','1'); }
          });
        }, 300);
      }
    }
    window.addEventListener('scroll', check, {passive:true});
    check();
  }
  
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initLineChart(); initBarChart(); });
  } else {
    initLineChart();
    initBarChart();
  }
})();


// S9 막대 그래프 스크롤 애니메이션
(function(){
  var bars9 = document.querySelectorAll('.s9-bar-fill[data-width]');
  if(!bars9.length) return;
  var animated9 = false;
  function checkBars9() {
    if(animated9) return;
    var section = document.querySelector('.s9-stats-wrap');
    if(!section) return;
    var rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.9) {
      animated9 = true;
      bars9.forEach(function(bar, i) {
        setTimeout(function() {
          bar.style.transition = 'width 1.2s ease';
          bar.style.width = bar.getAttribute('data-width');
        }, i * 150);
      });
    }
  }
  window.addEventListener('scroll', checkBars9, {passive:true});
  checkBars9();
})();


// S1 카드 텍스트 깜빡 애니메이션 (IntersectionObserver, 2번, 텍스트만)
(function(){
  var cards = document.querySelectorAll('.s1-card');
  if(!cards.length) return;

  function blinkCardText(card) {
    var content = card.querySelector('.s1-card-content');
    if(!content) return;
    var count = 0;
    var total = 4; // 2번 깜빡 = on/off × 2
    var interval = setInterval(function() {
      content.style.opacity = (count % 2 === 0) ? '0.1' : '1';
      count++;
      if(count >= total) {
        clearInterval(interval);
        content.style.opacity = '1';
      }
    }, 120);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting) {
        observer.unobserve(entry.target);
        blinkCardText(entry.target);
      }
    });
  }, {threshold: 0.5});

  cards.forEach(function(card) {
    observer.observe(card);
  });
})();

// S4 텍스트 순차 페이드인 (IntersectionObserver)
(function(){
  var s4overlay = document.getElementById('s4Overlay');
  if(!s4overlay) return;
  var fadeItems = s4overlay.querySelectorAll('.s4-fade-item');
  if(!fadeItems.length) return;
  var triggered = false;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting && !triggered) {
        triggered = true;
        observer.disconnect();
        fadeItems.forEach(function(item, i) {
          setTimeout(function() {
            item.classList.add('s4-visible');
          }, i * 320);
        });
      }
    });
  }, {threshold: 0.25});
  observer.observe(s4overlay);
})();

            
// ===== 영상 스크롤 진입 재생 (video 태그) =====
(function(){
  var videoObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        v.play().catch(function(){});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, {threshold: 0.3});
  
  function observeVideos() {
    document.querySelectorAll('video[autoplay]').forEach(function(v) {
      videoObs.observe(v);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeVideos);
  } else {
    observeVideos();
  }
})();



// 영상 재생속도 제어
document.addEventListener('DOMContentLoaded', function() {
  const poreVideo = document.querySelector('video[src*="pore_video"]');
  if (poreVideo) poreVideo.playbackRate = 2.0;
  const stepVideo = document.querySelector('video[src*="4step"]');
  if (stepVideo) stepVideo.playbackRate = 1.3;
});


(function(){var hds=document.querySelectorAll('.s13-accordion-header');hds.forEach(function(h){h.addEventListener('click',function(){var item=this.parentElement;var isOpen=item.classList.contains('open');document.querySelectorAll('.s13-accordion-item').forEach(function(el){el.classList.remove('open');});if(!isOpen)item.classList.add('open');});});})();
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();

    // 홈(/) 접속 시 상품 상세페이지로 리다이렉트
    (function(){
        var path = window.location.pathname;
        if (path === '/' || path === '/index.html') {
              window.location.replace('/product/detail.html?product_no=11');
        }
    })();
  }
})();
