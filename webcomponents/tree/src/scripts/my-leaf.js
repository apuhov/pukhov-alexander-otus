import {LitElement, html, css, property} from 'lit-element';

class MyLeaf extends LitElement {
    @property({type: String}) data;

    static get styles() {
        return css`li { list-style-type: square }`;
    }

    render() {
        return html`<li>leaf=${this.data}<slot></slot></li>`;
    }
}

customElements.define('my-leaf', MyLeaf);