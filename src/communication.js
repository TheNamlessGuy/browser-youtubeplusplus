const Communication = {
  _port: null,

  init: async function() {
    browser.runtime.onConnect.addListener(Communication._onConnect);
  },

  _onConnect: function(port) {
    Communication._port = port;
    port.onMessage.addListener(async (msg) => {
      if (!(msg.action in Communication._map)) {
        return; // What?
      }

      const response = (await Communication._map[msg.action](msg)) ?? {};
      port.postMessage({response: msg.action, ...JSON.parse(JSON.stringify(response))});
    });
  },

  _map: {
    'opts--get': async function() { return {result: await Opts.get() }; },
    'opts--set': async function(msg) { await Opts.set(msg.opts, msg.extras); },
    'opts--save-using-bookmark': async function() { return {result: BookmarkOpts._saveUsingBookmark }; },

    'sponsorblock--get': async function(msg) { return {result: await SponsorBlock.get(msg.id, msg.types.split(','))}; },
  },

  send: function(action, extras = {}) {
    if (Communication._port != null) {
      Communication._port.postMessage({action: action, ...JSON.parse(JSON.stringify(extras))});
    }
  },
};