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
    if (opts.sidebar.hideShorts) { inject('hide-shorts-from-sidebar'); }
    if (opts.sidebar.hideExplore) { inject('hide-explore-from-sidebar'); }
    if (opts.sidebar.hideMoreFromYt) { inject('hide-more-from-yt-from-sidebar'); }
    if (opts.sidebar.hideBrowseChannelsFromSubscriptions) { inject('hide-browse-channels-from-sidebar'); }
    if (url.pathname === '/watch') {
      if (opts.general.blockPlayOnPageLoad) { inject('stop-initial-play'); }
      if (opts.miniplayer.disable) { inject('disable-miniplayer'); }
      if (opts.general.disableNextButton) { inject('disable-next-button'); }
      if (opts.autoplay.default != null) { inject('toggle-autoplay', {value: opts.autoplay.default}); }
      if (opts.autoplay.hide) { inject('hide-autoplay'); }
      if (opts.general.defaultViewMode != null) { inject('to-view-mode', {mode: opts.general.defaultViewMode}); }
      if (opts.chapters.showButtons) { inject('show-chapter-buttons'); }
      if (opts.general.displayProgressBarWhenCollapsed) { inject('force-showing-progressbar'); }
      if (opts.general.hideChannelAnnotation) { inject('hide-channel-annotation'); }

      if (opts.sponsors.mark || opts.sponsors.autoSkip) {
        action('sponsorblock--get', {
          id: url.searchParams.get('v'),
          types: opts.sponsors.types.join(','),
        }).then((segments) => {
          if (segments.length > 0) {
            inject('mark-sponsor-segments', {
              segments: segments,
              skipHotkey: opts.sponsors.skipHotkey,
              mark: opts.sponsors.mark,
              autoSkip: opts.sponsors.autoSkip,
            });
          }
        });
      }
    } else if (url.pathname === '/feed/subscriptions') {
      if (opts.shorts.hideFromSubPage) { inject('hide-shorts-from-subpage'); }
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

        if (cb()) { resolve(); } // Early exit if it's already resolved

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

    timeout: () => new Promise((resolve) => setTimeout(resolve, 0)),
    adIsPlaying: () => ((document.getElementsByClassName('video-ads')[0]?.children.length > 0) ?? false),

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
      player: () => document.getElementById('movie_player'),
      video: (player = null) => (player ?? window['yt++'].elements.player()).getElementsByTagName('video')[0],
      chapterContainer: () => document.getElementsByClassName('ytp-chapters-container')[0],
      progressBarContainer: () => document.getElementsByClassName('ytp-progress-bar-container')[0],

      currentChapter: (chapterContainer) => Array.from((chapterContainer ?? window['yt++'].elements.chapterContainer()).children).map(x => x.getElementsByClassName('ytp-play-progress')[0]).find(x => x.style.transform !== 'scaleX(1)'),
    },

    onHotkeyPressed: (hotkey, cb, extras = {}) => {
      if (hotkey == null) { return; }

      const stopPropagation = extras.stopPropagation ?? true;
      const preventDefault = extras.preventDefault ?? true;

      document.addEventListener('keyup', (e) => {
        if (
          e.key.toLowerCase() === hotkey.key &&
          e.altKey === hotkey.alt &&
          e.ctrlKey === hotkey.ctrl &&
          e.shiftKey === hotkey.shift
        ) {
          cb(hotkey);

          if (stopPropagation) { e.stopPropagation(); }
          if (preventDefault) { e.preventDefault(); }
        }
      }, true);
    },

    ClassWatcher: class ClassWatcher { // https://stackoverflow.com/a/53914092
      constructor(target, clazz, onAdded, onRemoved = () => {}) {
        this.target = target;
        this.class = clazz;
        this.onAdded = onAdded;
        this.onRemoved = onRemoved;

        this.previousState = this.target.classList.contains(this.class);

        this._observer = new MutationObserver(this._onMutation.bind(this));
        this.observe();
      }

      _onMutation(mutations) {
        for (let mutation of mutations) {
          if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') { return; }

          const currentState = this.target.classList.contains(this.class);
          if (this.previousState !== currentState) {
            this.previousState = currentState;
            this.previousState ? this.onAdded(this) : this.onRemoved(this);
          }
        }
      }

      observe() { this._observer.observe(this.target, {attributes: true}); }
      disconnect() { this._observer.disconnect(); }
    },
  };

  window['yt++'].incognito = window['yt++'].data.bool('incognito');
  currentScript.dispatchEvent(new CustomEvent('yt++-initializer-ready'));
}());