(async function() {
  await window['yt++'].waitForOptional(() => window['yt++'].elements.player() != null);
  const player = window['yt++'].elements.player();

  function stopVideo() {
    player.pauseVideo();
    player.seekTo(0);

    const spinner = player.getElementsByClassName('ytp-spinner')[0];
    if (spinner != null) { spinner.style.display = 'none'; }
  }

  const callback = (state) => {
    if ([window['yt++'].States.PLAYING, window['yt++'].States.BUFFERING].includes(state)) {
      stopVideo();
    }
  };

  player.addEventListener('onStateChange', callback);
  if ([window['yt++'].States.PLAYING, window['yt++'].States.BUFFERING].includes(player.getPlayerState())) {
    stopVideo();
  }

  const finish = () => {
    player.removeEventListener('onStateChange', callback);
    document.removeEventListener('mousedown', finish, true);
    document.removeEventListener('keydown', finish, true);
  };
  document.addEventListener('mousedown', finish, true);
  document.addEventListener('keydown', finish, true);
}());