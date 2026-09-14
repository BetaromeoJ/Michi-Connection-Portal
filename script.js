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
      title: 'ワダリン｜教育者・イノベーター',
      description: '鹿児島で国語を教えるワダリンのポータル。教育、イノベーション、AI、学校DXを通じて、世界の教育者とつながります。'
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


  /* --- 3. Sakurajima time-lapse ------------------------------------

     Goal: it plays, it loops, and it never stops on its own.

     The <video> already carries autoplay + muted + loop + playsinline,
     which every current mobile browser allows silently. This block only
     exists for the cases where a browser still says no — iOS Low Power
     Mode, data saver, a strict iframe — and keeps trying:

       · sets .muted as a property, not just an attribute (Safari)
       · retries whenever the file becomes playable
       · retries when the section scrolls into view
       · retries when the tab is brought back to the front
       · retries once on the visitor's first tap anywhere on the page
       · and only if all of that fails, shows the play button

     It never pauses the clip itself, so nothing here can leave the video
     stopped. Reduced motion is the one exception: then the poster frame
     is shown as a still photo, which is what that setting asks for.
     ------------------------------------------------------------------ */

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var video = document.querySelector('.figure__media[poster]');
  var playBtn = document.querySelector('.video-play');

  if (video && reduceMotion) {
    video.removeAttribute('autoplay');
    video.pause();
  }

  if (video && !reduceMotion) {

    video.muted = true;               // property, not only the attribute
    video.loop = true;
    video.playsInline = true;

    var nudge = function (offerButton) {
      if (!video.paused && !video.ended) return;
      var playing = video.play();
      if (playing && playing.then) {
        playing.then(function () {
          if (playBtn) playBtn.hidden = true;
        }).catch(function () {
          if (playBtn && offerButton) playBtn.hidden = false;
        });
      }
    };

    // The clip is short; if it ever reaches the end, start it again.
    video.addEventListener('ended', function () {
      video.currentTime = 0;
      nudge(false);
    });

    // Retry as soon as there is something to play.
    ['loadeddata', 'canplay', 'canplaythrough'].forEach(function (evt) {
      video.addEventListener(evt, function () { nudge(false); });
    });

    // Some browsers stall a background video; pick it back up.
    video.addEventListener('pause', function () {
      window.setTimeout(function () { nudge(false); }, 300);
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) nudge(false);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) nudge(true);
        });
      }, { threshold: 0.15 }).observe(video);
    }

    // A first tap anywhere counts as the gesture a strict browser wants.
    var unlock = function () {
      nudge(false);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock, { passive: true, once: true });
    document.addEventListener('click', unlock, { once: true });

    if (playBtn) {
      playBtn.addEventListener('click', function () { nudge(false); });
    }

    nudge(false);
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
