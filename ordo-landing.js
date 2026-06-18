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

