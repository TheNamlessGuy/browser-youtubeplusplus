const Tabs = {
  init: async function() {
    if (!browser.tabs.onUpdated.hasListener(Tabs._onUpdated)) {
      browser.tabs.onUpdated.addListener(Tabs._onUpdated);
    }
  },

  _onUpdated: async function(tabID, changeInfo, tabInfo) {
    if (changeInfo.url == null) { return; }

    const url = new URL(changeInfo.url);
    const opts = await Opts.get();

    if (opts.shorts.redirectToRealVideoPage && url.pathname.startsWith('/shorts/')) {
      const id = url.pathname.substring(8); // 8 === '/shorts/'.length
      browser.tabs.update(tabID, {url: `${url.protocol}//${url.hostname}/watch?v=${id}`, loadReplace: true});
      return;
    }
  },
};