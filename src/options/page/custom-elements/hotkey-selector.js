class HotkeySelectorElement extends HTMLElement {
  _activeCheckbox;
  _input;

  _value = null;
  _disabled = false;

  constructor() {
    super();

    const container = document.createElement('div');

    const label = document.createElement('label');
    label.innerText = `${this.innerText}:`;
    container.appendChild(label);

    const rhs = document.createElement('span');
    rhs.classList.add('rhs');
    container.appendChild(rhs);

    this._activeCheckbox = document.createElement('input');
    this._activeCheckbox.type = 'checkbox';
    this._activeCheckbox.title = 'Whether or not hotkey is active';
    this._activeCheckbox.addEventListener('change', () => {
      if (this._activeCheckbox.checked) {
        this._input.disabled = false;
      } else {
        this._input.disabled = true;
        this._input.value = '';
        this.dispatchEvent(new Event('change'));
      }
    });
    rhs.appendChild(this._activeCheckbox);

    this._input = document.createElement('input');
    this._input.type = 'text';
    this._input.classList.add('input');
    this._input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (['Control', 'Shift', 'Alt'].includes(e.key)) { return; }

      this._setValue(this._buildHotkeyObject(e));
      this.dispatchEvent(new Event('change'));
    });
    rhs.appendChild(this._input);

    const style = document.createElement('style');
    style.textContent = `div { padding: 2px 0; } span.rhs { float: right; } input.input { text-align: center; font-family: monospace; }`;
    container.appendChild(style);

    this._setValue(null);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  _buildHotkeyObject(keyup) {
    return {
      key: keyup.key.toLowerCase(),
      alt: keyup.altKey,
      ctrl: keyup.ctrlKey,
      shift: keyup.shiftKey,
    };
  }

  _setValue(value, overwrite = true) {
    if (overwrite) { this._value = value; }

    if (value == null) {
      this._activeCheckbox.checked = false;

      this._input.value = '';
      this._input.disabled = true;
    } else {
      this._activeCheckbox.checked = true;

      this._input.value = value.key;
      if (value.alt  ) { this._input.value = `alt+${this._input.value}`; }
      if (value.shift) { this._input.value = `shift+${this._input.value}`; }
      if (value.ctrl ) { this._input.value = `ctrl+${this._input.value}`; }
      this._input.disabled = false;
    }

    let length = this._input.value.length;
    if (length < 5) { length = 5; }
    this._input.style.width = `${length}ch`;
  }

  disable(disabled = true) {
    this._disabled = disabled;

    if (this._disabled) {
      this._activeCheckbox.disabled = true;
      this._setValue(null, false);
    } else {
      this._activeCheckbox.disabled = false;
      this._setValue(this._value, false);
    }
  }

  get value() { return this._disabled ? null : this._value; }
  set value(value) { this._setValue(value); }
}