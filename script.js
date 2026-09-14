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

  /* --- 1. Language ------------------------------------------------

     How it works
     ------------
     Every translatable string sits in index.html twice, as
     <span data-lang="en">…</span><span data-lang="ja">…</span>.
     CSS hides whichever one does not match <html lang>. So switching
     language here is a single attribute change — no DOM is rebuilt, no
     markup is regenerated, and no event listener can be lost.

     The click handler is bound once to the switch container (event
     delegation), so it keeps working however many times you toggle.
     ------------------------------------------------------------------ */

  // Page metadata per language. Body copy lives in index.html.
  var META = {
    en: {
      title: 'Michi Wada | Educator & Innovator',
      description: 'Michi Wada is a Japanese educator from Kagoshima, Japan, connecting with educators around the world through education, innovation, AI, and school transformation.'
    },
    ja: {
      title: 'ワダミチ｜教育者・イノベーター',
      description: '鹿児島で国語を教えるワダミチのポータル。教育、イノベーション、AI、学校DXを通じて、世界の教育者とつながります。'
    }
  };

  var switcher = document.querySelector('.lang-switch');
  var descTag = document.querySelector('meta[name="description"]');
  var currentLang = null;

  function applyLang(lang) {
    if (lang !== 'ja') lang = 'en';
    if (lang === currentLang) return;
    currentLang = lang;

    // This one attribute is what shows one language and hides the other.
    document.documentElement.setAttribute('lang', lang);

    document.title = META[lang].title;
    if (descTag) descTag.setAttribute('content', META[lang].description);

    // Alt text follows the language too.
    var imgs = document.querySelectorAll('img[data-alt-ja]');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.getAttribute('data-alt-en') === null) {
        img.setAttribute('data-alt-en', img.getAttribute('alt') || '');
      }
      img.setAttribute('alt', img.getAttribute('data-alt-' + lang) || '');
    }

    // …and so does the label on the Sakurajima video.
    var labelled = document.querySelectorAll('[data-aria-ja]');
    for (var m = 0; m < labelled.length; m++) {
      var el = labelled[m];
      if (el.getAttribute('data-aria-en') === null) {
        el.setAttribute('data-aria-en', el.getAttribute('aria-label') || '');
      }
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang) || '');
    }

    // Button state always matches what is on screen.
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var j = 0; j < buttons.length; j++) {
      var on = buttons[j].getAttribute('data-set-lang') === lang;
      buttons[j].classList.toggle('is-on', on);
      buttons[j].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  // One listener on the container, bound once. Works for any number of
  // switches in either direction, for as long as the page is open.
  if (switcher) {
    switcher.addEventListener('click', function (event) {
      var btn = event.target.closest ? event.target.closest('[data-set-lang]') : null;
      if (btn && switcher.contains(btn)) {
        applyLang(btn.getAttribute('data-set-lang'));
      }
    });
  }

  // Every visit starts in English — no browser-language guess, nothing
  // remembered between visits. The MEL26 visitor who scans the QR code
  // always lands on the English page, whatever their phone is set to.
  currentLang = null;
  applyLang('en');


  /* --- 2. The switch steps back once the hero is gone -------------- */

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
