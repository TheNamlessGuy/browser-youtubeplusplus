(function() {
  function prune(obj) {
    delete obj.playerAds;
    delete obj.adPlacements;

    if (obj.playerResponse != null) {
      delete obj.playerResponse.playerAds;
      delete obj.playerResponse.adPlacements;
    }

    return obj;
  };

  JSON.parse = new Proxy(JSON.parse, {
    apply: function() { return prune(Reflect.apply(...arguments)); }
  });

  Response.prototype.json = new Proxy(Response.prototype.json, {
    apply: function() { return Reflect.apply(...arguments).then(obj => prune(obj)); }
  });

  function replace(name) {
    let _tmp = null;
    Object.defineProperty(window, name, {
      configurable: false,
      get() { return _tmp; },
      set(value) {
        _tmp = new Proxy(value, {
          get: function(obj, property, value) {
            if (property === 'adPlacements') { return []; }
            return obj[property];
          },
        });
      },
    });
  }

  replace('playerResponse');
  replace('ytInitialPlayerResponse');
}());