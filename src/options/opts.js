const Opts = {
  _default: {
    general: {
      blockPlayOnPageLoad: true,
      defaultViewMode: 'theater',
      autoRejectCookiePopupInIncognitoMode: true,
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