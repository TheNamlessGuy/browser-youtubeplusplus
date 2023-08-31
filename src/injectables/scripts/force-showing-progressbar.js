(async function() {
  /**
   * Explanation:
   * Listen for when the progress bar WOULD be hidden. Unhide it by faking mouse events, and instead show it on the bottom of the page.
   * If we get a mousemove event that ISN'T faked, we assume it was made by the user, and we stop forcing it to the bottom (until the next hide event).
   */

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-chrome-bottom')[0] != null);
  const bottom = document.getElementsByClassName('ytp-chrome-bottom')[0];
  if (bottom == null) { return; }
  const bottomHeight = bottom.getBoundingClientRect().height;

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-chrome-top')[0] != null);
  const top = document.getElementsByClassName('ytp-chrome-top')[0];
  if (top == null) { return; }

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-gradient-top')[0] != null);
  const gradient = document.getElementsByClassName('ytp-gradient-top')[0];
  if (gradient == null) { return; }

  await window['yt++'].waitForOptional(() => document.getElementsByClassName('ytp-progress-bar-container')[0] != null);
  const container = bottom.getElementsByClassName('ytp-progress-bar-container')[0];
  if (container == null) { return; }
  const containerHeight = container.getBoundingClientRect().height;

  const style = document.createElement('style');
  style.textContent = `
.ytp-chrome-bottom.ytpp-hide { opacity: 0.3 !important; bottom: -${bottomHeight - containerHeight}px !important; }
.ytp-chrome-top.ytpp-hide { display: none; }
.ytp-gradient-top.ytpp-hide { display: none; }
`;
  document.head.appendChild(style);

  const player = window['yt++'].elements.player();
  const listener = (e) => {
    if (actuallyHidden && !('yt++' in e)) {
      actuallyHidden = false;
      player.classList.add('ytp-autohide');
      setTimeout(() => player.classList.remove('ytp-autohide')); // This timeout is needed so that the ClassWatcher can actually notice that the change occured
    }
  };
  player.parentElement.addEventListener('mousemove', listener, true);

  let actuallyHidden = false;
  let firstTime = true;
  new window['yt++'].ClassWatcher(player, 'ytp-autohide', () => {
    if (firstTime) {
      firstTime = false;
      actuallyHidden = true;
      top.classList.add('ytpp-hide');
      bottom.classList.add('ytpp-hide');
      gradient.classList.add('ytpp-hide');
    }

    player.parentElement.removeEventListener('mousemove', listener, true);
    player.parentElement.addEventListener('mousemove', listener, true);

    if (actuallyHidden) {
      let event = new MouseEvent('mousemove');
      event['yt++'] = true;
      player.dispatchEvent(event);

      event = new MouseEvent('mouseover');
      event['yt++'] = true;
      player.dispatchEvent(event);
    }
  }, () => {
    if (!actuallyHidden) {
      firstTime = true;
      top.classList.remove('ytpp-hide');
      bottom.classList.remove('ytpp-hide');
      gradient.classList.remove('ytpp-hide');
    }
  });
}());