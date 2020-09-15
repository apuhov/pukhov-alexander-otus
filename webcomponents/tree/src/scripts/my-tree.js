import {LitElement, html, css, property} from 'lit-element';
import './my-leaf.js';

class MyTree extends LitElement {
    @property({type: Object}) data;

    static get styles() {
        return css`ul { border: dashed grey 1px }`;
    }

    render() {
        console.log(this.data);
        return html`<ul id="my-tree">
            <my-leaf data="${this.data.id}">                
                ${this.data.items && this.data.items.length && this.data.items.map(i => html`<my-tree data="${JSON.stringify(i)}"></my-tree>`)}
            </my-leaf></ul>`;
    }
}

customElements.define('my-tree', MyTree);