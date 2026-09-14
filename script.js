/* ===================================================================
   Michi Connection Portal — script.js

   Two small jobs:
     1. the EN / 日本語 switch
     2. a soft reveal for the photos below the fold

   Everything on the page reads and every link works with JavaScript
   disabled; the page then simply stays in English.
   =================================================================== */

(function () {
  'use strict';

  /* --- 1. Language ------------------------------------------------ */

  // Page metadata per language. Body copy lives in index.html.
  var META = {
    en: {
      title: 'Michi Wada | Educator & Innovator',
      description: 'Michi Wada is a Japanese educator from Kagoshima, Japan, connecting with educators around the world through education, innovation, AI, and school transformation.'
    },
    ja: {
      title: 'Michi Wada｜教育者・イノベーター',
      description: '鹿児島で国語を教える Michi Wada のポータル。教育、イノベーション、AI、学校DXを通じて、世界の教育者とつながります。'
    }
  };

  var buttons = document.querySelectorAll('[data-set-lang]');
  var descTag = document.querySelector('meta[name="description"]');

  function applyLang(lang) {
    if (lang !== 'ja') lang = 'en';

    document.documentElement.setAttribute('lang', lang);
    document.title = META[lang].title;
    if (descTag) descTag.setAttribute('content', META[lang].description);

    // Alt text follows the language too.
    var imgs = document.querySelectorAll('img[data-alt-ja]');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.getAttribute('data-alt-en')) {
        img.setAttribute('data-alt-en', img.getAttribute('alt') || '');
      }
      img.setAttribute('alt', img.getAttribute('data-alt-' + lang) || '');
    }

    // …and so does the label on the Sakurajima video.
    var labelled = document.querySelectorAll('[data-aria-ja]');
    for (var m = 0; m < labelled.length; m++) {
      var el = labelled[m];
      if (!el.getAttribute('data-aria-en')) {
        el.setAttribute('data-aria-en', el.getAttribute('aria-label') || '');
      }
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang) || '');
    }

    for (var j = 0; j < buttons.length; j++) {
      var on = buttons[j].getAttribute('data-set-lang') === lang;
      buttons[j].classList.toggle('is-on', on);
      buttons[j].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  for (var k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener('click', function () {
      applyLang(this.getAttribute('data-set-lang'));
    });
  }

  // Every visit starts in English — no browser-language guess, nothing
  // remembered between visits. The MEL26 visitor who scans the QR code
  // always lands on the English page, whatever their phone is set to.
  applyLang('en');


  /* --- 2. The switch steps back once the hero is gone -------------- */

  var switcher = document.querySelector('.lang-switch');
  if (switcher) {
    var compact = false;
    var onScroll = function () {
      var past = window.pageYOffset > 160;
      if (past !== compact) {
        compact = past;
        switcher.classList.toggle('is-compact', past);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* --- 3. Sakurajima time-lapse ------------------------------------ */

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var video = document.querySelector('.figure__media[poster]');

  // The clip is ~1.5 MB. preload="none" in the HTML means nothing is
  // fetched until play() is called here, and that only happens once the
  // section is actually on screen. Reduced motion keeps the poster still.
  var playBtn = document.querySelector('.video-play');

  function tryPlay(showButtonOnFailure) {
    var playing = video.play();
    if (playing && playing.then) {
      playing.then(function () {
        if (playBtn) playBtn.hidden = true;
      }).catch(function () {
        // Autoplay refused (iOS Low Power Mode, data saver). Offer the button.
        if (playBtn && showButtonOnFailure) playBtn.hidden = false;
      });
    }
  }

  if (video && playBtn) {
    playBtn.addEventListener('click', function () { tryPlay(false); });
  }

  if (video && !reduceMotion && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tryPlay(true);
        } else if (!entry.target.paused) {
          entry.target.pause();          // off screen: no battery, no data
        }
      });
    }, { threshold: 0.25 }).observe(video);
  }


  /* --- 4. Reveal -------------------------------------------------- */

  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  function showAll() {
    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.add('is-visible');
    }
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  targets.forEach(function (el) { observer.observe(el); });

  // Failsafe: nothing stays invisible, whatever happens above.
  window.setTimeout(showAll, 2500);
})();
