const Opts = {
  _default: {
    general: {
      blockPlayOnPageLoad: true,
      defaultViewMode: 'theater',
      autoRejectCookiePopupInIncognitoMode: true,
      displayProgressBarWhenCollapsed: true,
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
    },
  },

  init: async function() {
    let {opts, changed} = await BookmarkOpts.init(Opts._default);

    if (!('ads' in opts)) { // Added in v0.0.3
      opts.ads = JSON.parse(JSON.stringify(Opts._default.ads));
      changed = true;
    }

    if (!('displayProgressBarWhenCollapsed' in opts.general)) { // Added in v0.0.3
      opts.general.displayProgressBarWhenCollapsed = Opts._default.general.displayProgressBarWhenCollapsed;
      changed = true;
    }

    if (!('sidebar' in opts)) { // Added in v0.0.5
      opts.sidebar = JSON.parse(JSON.stringify(Opts._default.sidebar));
      changed = true;
    }

    if ([true, false].includes(opts.sponsors.autoSkip)) { // Changed to array in v0.0.5. No backwards compatibility needed
      opts.sponsors.autoSkip = Opts._default.sponsors.autoSkip;
      changed = true;
    }

    if (!('hideFromSubPage' in opts.shorts)) {
      opts.shorts.hideFromSubPage = Opts._default.shorts.hideFromSubPage;
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