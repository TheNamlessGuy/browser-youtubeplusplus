(async function() {
  const mode = window['yt++'].data.get('mode');

  await window['yt++'].waitForOptional(() => document.getElementsByTagName('ytd-watch-flexy')[0] != null);

  // Are we in the correct mode already?
  const flexy = document.getElementsByTagName('ytd-watch-flexy')[0];
  if (flexy == null || (mode === 'theater' && flexy.hasAttribute('theater')) || (mode === 'default' && !flexy.hasAttribute('theater'))) { return; }

  const player = window['yt++'].elements.player();
  if (player == null) { return; }

  const btn = player.getElementsByClassName('ytp-size-button')[0];
  if (btn == null) { return; }

  await window['yt++'].timeout(2000);
  btn.click();
}());