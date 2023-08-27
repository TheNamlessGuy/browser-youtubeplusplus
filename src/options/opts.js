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

    miniplayer: {
      disable: true,
    },

    chapters: {
      showButtons: true,
    },

    sponsors: {
      mark: true,
      autoSkip: false, // TODO
      types: ['sponsor'],
    },

    shorts: {
      redirectToRealVideoPage: true,
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