(async function() {
  if (document.getElementsByClassName('yt++-previous-chapter-btn')[0] != null) { return; } // Already added

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

  await window['yt++'].waitForOptional(() => controls.getElementsByClassName('ytp-chapter-container')[0]?.getElementsByClassName('ytp-chapter-title')[0] != null);
  const chapterBtn = controls.getElementsByClassName('ytp-chapter-container')[0]?.getElementsByClassName('ytp-chapter-title')[0];
  if (chapterBtn == null) { return; }

  const back = document.createElement('button');
  back.classList.add('ytp-button', 'yt++-previous-chapter-btn');
  back.title = 'Previous chapter';
  back.innerHTML = '&#8617;';
  back.style.fontSize = '200%';
  back.style.display = 'flex';
  back.style.justifyContent = 'space-around';
  back.addEventListener('click', () => dispatch('ArrowLeft', 37));
  chapterBtn.insertBefore(back, chapterBtn.firstChild);

  const forward = document.createElement('button');
  forward.classList.add('ytp-button', 'yt++-next-chapter-btn');
  forward.title = 'Next chapter';
  forward.innerHTML = '&#8618;';
  forward.style.fontSize = '200%';
  forward.style.display = 'flex';
  forward.style.justifyContent = 'space-around';
  forward.addEventListener('click', () => dispatch('ArrowRight', 39));
  chapterBtn.appendChild(forward);
}());