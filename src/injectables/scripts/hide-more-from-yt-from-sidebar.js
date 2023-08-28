(function() {
  function getElement() {
    return Array.from(document.getElementsByTagName('ytd-guide-section-renderer')).filter(x => x.getElementsByTagName('h3')[0].innerText === 'More from YouTube')[0];
  }

  // If the sidebar is expanded, hide the stuff
  window['yt++'].waitForOptional(() => getElement() != null).then(() => {
    const element = getElement();
    if (element != null) { element.style.display = 'none'; }
  });

  // If the sidebar is collapsed, wait for it to show, and then hide
  window['yt++'].waitForOptional(() => document.getElementsByTagName('tp-yt-app-drawer')[0] != null).then(() => {
    const appDrawer = document.getElementsByTagName('tp-yt-app-drawer')[0];
    if (appDrawer != null) {
      new window['yt++'].ClassWatcher(appDrawer.querySelector('#scrim'), 'visible', (watcher) => {
        window['yt++'].waitForOptional(() => getElement() != null, {interval: 10}).then(() => {
          const element = getElement();
          if (element != null) {
            element.style.display = 'none';
            watcher.disconnect();
          }
        });
      });
    }
  });
}());