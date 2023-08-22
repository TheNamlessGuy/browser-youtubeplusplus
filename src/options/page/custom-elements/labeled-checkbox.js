class LabeledCheckboxElement extends HTMLElement {
  _input;

  static observedAttributes = ['disabled'];

  constructor() {
    super();

    const container = document.createElement('div');

    const label = document.createElement('label');
    label.innerText = `${this.innerText}:`;
    container.appendChild(label);

    this._input = document.createElement('input');
    this._input.type = 'checkbox';
    this._input.addEventListener('change', () => this.dispatchEvent(new Event('change')));
    container.appendChild(this._input);

    const style = document.createElement('style');
    style.textContent = `div { padding: 2px 0; } input { float: right; }`;
    container.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this._input.disabled = newValue === 'true';
    }
  }

  get value() {
    return this._input.checked;
  }

  set value(value) {
    this._input.checked = value;
  }
}