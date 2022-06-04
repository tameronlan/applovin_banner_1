export default {
    name: 'ComponentView',
    props: {
        component: {
            required: true
        },
        props: Object
    },
    render(createElement) {
        const data = {
            props: this.props
        };

        return createElement(
        this.component,
        data,
        this.$slots.default
        );
    }
};
