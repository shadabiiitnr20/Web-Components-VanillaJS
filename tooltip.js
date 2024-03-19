class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipIcon;
    this._tooltipVisible = false;
    this._tooltiptext = "Some Dummy Tooltip Text";
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <style>

    :host {
        position: relative;
    }

        div {
            background-color: black;
            color: white;
            position: absolute;
            z-index: 10;
            padding: 8px;
        }
    </style>
    <slot>Some Default</slot>
    <span> (?)</span>
    
    `;
  }

  connectedCallback() {
    if (this.hasAttribute("text")) {
      this._tooltiptext = this.getAttribute("text");
    }
    this._tooltipIcon = this.shadowRoot.querySelector("span");
    this._tooltipIcon.addEventListener(
      "mouseenter",
      this._showTooltip.bind(this)
    );
    this._tooltipIcon.addEventListener(
      "mouseleave",
      this._hideTooltip.bind(this)
    );
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "text") {
      this._tooltiptext = newValue;
    }
  }

  static get observedAttributes() {
    return ["text"];
  }

  disconnectedCallback() {
    this._tooltipIcon.removeEventListener("mouseenter", this._showTooltip);
    this._tooltipIcon.removeEventListener("mouseleave", this._hideTooltip);
  }

  _render() {
    let tooltipContainer = this.shadowRoot.querySelector("div");
    if (this._tooltipVisible) {
      tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = this._tooltiptext;
      this.shadowRoot.appendChild(tooltipContainer);
    } else {
      if (tooltipContainer) {
        this.shadowRoot.removeChild(tooltipContainer);
      }
    }
  }

  //This is the method, only to be called within the same class
  _showTooltip() {
    this._tooltipVisible = true;
    this._render();
  }

  _hideTooltip() {
    this._tooltipVisible = false;
    this._render();
  }
}

customElements.define("ms-tooltip", Tooltip);
