(async function() {
  function dispatch(key, keyCode) {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: key,
      keyCode: keyCode,
      which: keyCode,
      code: key,
      location: 0,
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      repeat: false,
    }));
  }

  await window['yt++'].waitForOptional(() => window['yt++'].elements.chapterContainer() != null);

  const chapterContainer = window['yt++'].elements.chapterContainer();
  await window['yt++'].waitForOptional(() => chapterContainer.children.length > 1);

  if (chapterContainer.children.length < 2) { return; }

  const controls = document.getElementsByClassName('ytp-left-controls')[0];
  const volume = controls.getElementsByClassName('ytp-volume-area')[0];

  const back = document.createElement('button');
  back.classList.add('ytp-button');
  back.title = 'Previous chapter';
  back.innerHTML = '&#8617;';
  back.style.fontSize = '200%';
  back.style.display = 'flex';
  back.style.justifyContent = 'space-around';
  back.addEventListener('click', () => dispatch('ArrowLeft', 37));
  controls.insertBefore(back, volume);

  const forward = document.createElement('button');
  forward.classList.add('ytp-button');
  forward.title = 'Next chapter';
  forward.innerHTML = '&#8618;';
  forward.style.fontSize = '200%';
  forward.style.display = 'flex';
  forward.style.justifyContent = 'space-around';
  forward.addEventListener('click', () => dispatch('ArrowRight', 39));
  controls.insertBefore(forward, volume);
}());