(async function() {
  const mode = window['yt++'].data.get('mode');
  // Are we in the correct mode already?
  const modeMatch = () => (mode === 'theater' && flexy.hasAttribute('theater')) || (mode === 'default' && !flexy.hasAttribute('theater'));

  await window['yt++'].waitForOptional(() => document.getElementsByTagName('ytd-watch-flexy')[0] != null);
  const flexy = document.getElementsByTagName('ytd-watch-flexy')[0];
  if (flexy == null || modeMatch()) { return; }

  await window['yt++'].waitForOptional(() => window['yt++'].elements.player() != null);
  const player = window['yt++'].elements.player();
  if (player == null) { return; }

  await window['yt++'].waitForOptional(() => player.getElementsByClassName('ytp-size-button')[0] != null);
  const btn = player.getElementsByClassName('ytp-size-button')[0];
  if (btn == null) { return; }

  while (true) {
    btn.click();
    await window['yt++'].timeout();
    if (modeMatch()) { break; }
  }
}());