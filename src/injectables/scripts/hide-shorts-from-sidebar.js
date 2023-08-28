(function() {
  function getElement() {
    return Array.from(document.getElementsByTagName('ytd-guide-entry-renderer')).filter(x => x.innerText === 'Shorts')[0];
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

  // If you collapse the sidebar on a non-watch page, you still get a little "Shorts" icon. Destroy it!
  function getSecondaryElement() {
    return Array.from(document.getElementsByTagName('ytd-mini-guide-renderer')[0]?.getElementsByTagName('ytd-mini-guide-entry-renderer') ?? []).filter(x => x.getElementsByClassName('title')[0].innerText === 'Shorts')[0];
  }

  window['yt++'].waitForOptional(() => getSecondaryElement() != null).then(() => {
    const element = getSecondaryElement();
    if (element != null) { element.style.display = 'none'; }
  });
}());