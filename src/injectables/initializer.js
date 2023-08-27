(function() {
  const currentScript = document.currentScript;

  function inject(url, params = null) {
    currentScript.dispatchEvent(new CustomEvent('yt++-inject', {detail: JSON.stringify({url: url, params: params})}));
  }

  async function action(action, extras = {}) {
    return new Promise((resolve) => {
      const listener = (e) => {
        const data = JSON.parse(e.detail);
        if (data.response === action) {
          currentScript.removeEventListener('yt++-response', listener);
          resolve(data.result);
        }
      };
      currentScript.addEventListener('yt++-response', listener);

      currentScript.dispatchEvent(new CustomEvent('yt++-action', {detail: JSON.stringify({action, ...extras})}));
    });
  }

  currentScript.addEventListener('yt++-opts-update', (e) => {
    const opts = JSON.parse(e.detail);
    const url = new URL(window.location.href);

    if (opts.general.autoRejectCookiePopupInIncognitoMode && window['yt++'].incognito) { inject('reject-cookies'); }
    if (url.pathname === '/watch') {
      if (opts.ads.block) { inject('block-ads', {channelExceptions: opts.ads.channelExceptions}); }
      if (opts.general.blockPlayOnPageLoad) { inject('stop-initial-play'); }
      if (opts.miniplayer.disable) { inject('disable-miniplayer'); }
      if (opts.autoplay.hide) { inject('hide-autoplay'); }
      if (opts.autoplay.default != null) { inject('toggle-autoplay', {value: opts.autoplay.default}); }
      if (opts.general.defaultViewMode != null) { inject('to-view-mode', {mode: opts.general.defaultViewMode}); }
      if (opts.chapters.showButtons) { inject('show-chapter-buttons'); }
      if (opts.general.displayProgressBarWhenCollapsed) { inject('force-showing-progressbar'); }

      if (opts.sponsors.mark || opts.sponsors.autoSkip) {
        action('sponsorblock--get', {
          id: url.searchParams.get('v'),
          types: opts.sponsors.types.join(','),
        }).then((segments) => {
          if (segments.length > 0) {
            inject('mark-sponsor-segments', {
              segments: segments,
              mark: opts.sponsors.mark,
              autoSkip: opts.sponsors.autoSkip,
            });
          }
        });
      }
    }
  });

  if (window['yt++'] != null) {
    window['yt++'].incognito = window['yt++'].data.bool('incognito');
    return;
  }

  window['yt++'] = {
    incognito: false,

    background: {
      send: function(action, extras = {}) {
        return new Promise((resolve) => {
          const listener = (e) => {
            if (e.response !== action) { return; }
            currentScript.removeEventListener('yt++-response', listener);
            resolve(e.detail);
          };
          currentScript.addEventListener('yt++-response', listener);

          currentScript.dispatchEvent(new CustomEvent('yt++-action', {detail: {action: action, ...JSON.parse(JSON.stringify(extras))}}));
        });
      },
    },

    waitForOptional: (cb, extras = {}) => {
      return new Promise((resolve) => {
        // Wait for cb to return true, or for 5 seconds after page load
        let life = extras.life ?? 20;
        const interval = extras.interval ?? 250;

        const id = setInterval(() => {
          if (document.readyState === 'complete') {
            life -= 1;
            if (life === 0) {
              clearInterval(id);
              resolve();
              return;
            }
          }

          if (cb()) {
            clearInterval(id);
            resolve();
          }
        }, interval);
      });
    },

    timeout: (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    adIsPlaying: () => {
      return (document.getElementsByClassName('video-ads')[0]?.children.length > 0) ?? false;
    },

    States: { // https://developers.google.com/youtube/iframe_api_reference#Events
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 5,
    },

    data: {
      get: (key) => {
        return new URL(document.currentScript.src).searchParams.get(key);
      },

      array: (key) => window['yt++'].data.json(key),
      json: (key) => {
        return JSON.parse(window['yt++'].data.get(key));
      },

      bool: (key) => {
        return window['yt++'].data.get(key) === 'true';
      },

    },

    elements: {
      player: () => {
        return document.getElementById('movie_player');
      },

      chapterContainer: () => {
        return document.getElementsByClassName('ytp-chapters-container')[0];
      },

      progressBarContainer: () => {
        return document.getElementsByClassName('ytp-progress-bar-container')[0];
      },
    },
  };

  window['yt++'].incognito = window['yt++'].data.bool('incognito');
}());