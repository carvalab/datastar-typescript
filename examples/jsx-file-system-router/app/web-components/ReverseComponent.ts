/**
 * ReverseComponent - Web Component that reverses a string
 * Based on: https://data-star.dev/examples/web_component
 */
class ReverseComponent extends HTMLElement {
    static get observedAttributes() {
        return ["name"];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (newValue === null) return;

        const len = newValue.length;
        const codePoints = Array(len);
        let i = len - 1;
        for (const char of newValue) {
            codePoints[i--] = char.codePointAt(0);
        }
        const value = String.fromCodePoint(...codePoints);
        this.dispatchEvent(new CustomEvent("reverse", { detail: { value } }));
    }
}

customElements.define("reverse-component", ReverseComponent);

export default ReverseComponent;

