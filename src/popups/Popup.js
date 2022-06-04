let id = 0;

export default class Popup {
    constructor({ component, props, options }) {
        this.id = ++id;
        this.component = component;
        this.props = props || {};

        this.options = options || {};
    }

    show(animated) {
        throw new Error('Popup: method hide is not implemented!');
    }

    hide(animated) {
        throw new Error('Popup: method hide is not implemented!');
    }
};
