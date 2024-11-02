const injected = [];
function inject(url, params, overrideURL = false) {
  const script = document.createElement('script');
  script.src = browser.runtime.getURL(overrideURL ? url : `/src/injectables/scripts/${url}.js`);

  if (params != null) {
    script.src += '?'
    const keys = Object.keys(params);
    for (let k = 0; k < keys.length; ++k) {
      if (k > 0) { script.src += '&'; }

      let value = params[keys[k]];
      if (typeof value === 'object') { value = JSON.stringify(value); }
      script.src += `${keys[k]}=${value}`;
    }
  }

  document.documentElement.appendChild(script);
  script.remove();
  return script;
}

function resolveMsg(msg) {
  if (msg.response === 'opts--get') {
    script.dispatchEvent(new CustomEvent('yt++-opts-update', {
      detail: JSON.stringify(msg.result),
    }));
  } else if (msg.action === 'opts-update') {
    script.dispatchEvent(new CustomEvent('yt++-opts-update', {
      detail: JSON.stringify(msg.opts),
    }));
  }
}

let initializerReady = false;
const backlog = [];

/**
 * We need to inject to the real JS page,
 * instead of the faux-pas one that is generated for the plugin in order to access the YT functions properly.
 */
const script = inject('/src/injectables/initializer.js', {
  incognito: browser.extension.inIncognitoContext,
}, true);

script.addEventListener('yt++-inject', (e) => {
  const data = JSON.parse(e.detail);
  const url = data.url;
  const params = data.params ?? null;

  if (!injected.includes(url)) {
    injected.push(url);
    inject(url, params);
  }
});

script.addEventListener('yt++-action', (e) => {
  const data = JSON.parse(e.detail);

  const listener = (msg) => {
    if (msg.response === data.action) {
      port.onMessage.removeListener(listener);
      script.dispatchEvent(new CustomEvent('yt++-response', {
        detail: JSON.stringify(msg),
      }));
    }
  };
  port.onMessage.addListener(listener);

  port.postMessage(data);
});

script.addEventListener('yt++-initializer-ready', () => {
  initializerReady = true;
  while (backlog.length > 0) {
    resolveMsg(backlog.shift());
  }
});

const port = browser.runtime.connect();
port.onMessage.addListener((msg) => {
  if (initializerReady) {
    resolveMsg(msg);
  } else {
    backlog.push(msg);
  }
});
port.postMessage({action: 'opts--get'});