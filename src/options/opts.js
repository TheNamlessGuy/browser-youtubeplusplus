const Opts = {
  _default: {
    general: {
      blockPlayOnPageLoad: true,
      defaultViewMode: 'theater',
      autoRejectCookiePopupInIncognitoMode: true,
      displayProgressBarWhenCollapsed: true,
      hideChannelAnnotation: true,
      disableNextButton: true,
    },

    ads: {
      block: true,
      channelExceptions: [], // TODO
    },

    autoplay: {
      default: false,
      hide: true,
    },

    chapters: {
      showButtons: true,
    },

    miniplayer: {
      disable: true,
    },

    shorts: {
      redirectToRealVideoPage: true,
      hideFromSubPage: true,
    },

    sidebar: {
      hideShorts: true,
      hideExplore: true,
      hideMoreFromYt: true,
      hideBrowseChannelsFromSubscriptions: true,
    },

    sponsors: {
      mark: true,
      autoSkip: [],
      types: ['sponsor'],
      skipHotkey: {key: 's', alt: false, ctrl: false, shift: false},
    },
  },

  _v: () => browser.runtime.getManifest().version,

  init: async function() {
    let {opts, changed} = await BookmarkOpts.init(Opts._default);

    const currentVersion = Opts._v();
    const optsVersion = opts._v ?? '0.0.0';

    if (optsVersion < '0.0.3') {
      if (!('ads' in opts)) { // Added
        opts.ads = JSON.parse(JSON.stringify(Opts._default.ads));
        changed = true;
      }

      if (!('displayProgressBarWhenCollapsed' in opts.general)) { // Added
        opts.general.displayProgressBarWhenCollapsed = Opts._default.general.displayProgressBarWhenCollapsed;
        changed = true;
      }
    }

    if (optsVersion < '0.0.5') {
      if (!('sidebar' in opts)) { // Added
        opts.sidebar = JSON.parse(JSON.stringify(Opts._default.sidebar));
        changed = true;
      }

      if ([true, false].includes(opts.sponsors.autoSkip)) { // Changed to array. No backwards compatibility needed
        opts.sponsors.autoSkip = Opts._default.sponsors.autoSkip;
        changed = true;
      }

      if (!('hideFromSubPage' in opts.shorts)) { // Added
        opts.shorts.hideFromSubPage = Opts._default.shorts.hideFromSubPage;
        changed = true;
      }
    }

    if (optsVersion < '0.1.0') {
      if (!('skipHotkey' in opts.sponsors)) { // Added
        opts.sponsors.skipHotkey = JSON.parse(JSON.stringify(Opts._default.sponsors.skipHotkey));
        changed = true;
      }
    }

    if (optsVersion < '0.2.0') {
      if (!('hideChannelAnnotation' in opts.general)) { // Added
        opts.general.hideChannelAnnotation = Opts._default.general.hideChannelAnnotation;
        changed = true;
      }
    }

    if (optsVersion < '0.3.0') {
      if (!('disableNextButton' in opts.general)) { // Added
        opts.general.disableNextButton = Opts._default.general.disableNextButton;
        changed = true;
      }
    }

    if (currentVersion > optsVersion) {
      opts._v = currentVersion;
      changed = true;
    }

    if (changed) {
      await Opts.set(opts);
    }
  },

  get: async function() {
    const opts = await BookmarkOpts.get();
    if (opts != null && Object.keys(opts).length > 0) {
      return opts;
    }

    await Opts.init();
    return await Opts.get();
  },

  set: async function(opts, extras = {}) {
    await BookmarkOpts.set(opts, extras);
    Communication.send('opts-update', {opts: opts});
  },
};