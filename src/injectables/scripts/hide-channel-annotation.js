(async function() {
  await window['yt++'].waitForOptional(() => window['yt++'].elements.player() != null);
  const player = window['yt++'].elements.player();
  if (player == null) { return; }

  await window['yt++'].waitForOptional(() => window['yt++'].elements.video(player) != null);
  const video = window['yt++'].elements.video(player);
  if (video == null) { return; }

  const listener = () => {
    const annotation = player.querySelector('.annotation-type-custom.iv-branding');
    if (annotation != null) {
      annotation.style.display = 'none';
      video.removeEventListener('timeupdate', listener);
    }
  };

  video.addEventListener('timeupdate', listener);
}());