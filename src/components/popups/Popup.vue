<template>
    <div class="popup" :class="classes" ref="popup">
        <div class="popup__bg"></div>
        <div class="popup__content">
            <component-view :component="popup.component" :props="{...popup.props, popup}"/>
        </div>
    </div>
</template>

<script>
    import {animationEndEvent} from '@/lib/browser';
    import EventBus from "../../lib/EventBus";

    export default {
        name: 'Popup',
        props: {
            popup: {
                type: Object
            }
        },
        data() {
            return {
                hidden: true,
                animationShow: false,
                animationHide: false
            };
        },
        computed: {
            classes() {
                const classes = {
                    'popup_hidden': this.hidden,
                    'popup_animation-show': this.animationShow,
                    'popup_animation-hide': this.animationHide
                };

                if (this.popup.options.myClass) {
                    classes[this.popup.options.myClass] = true;
                }

                return classes;
            }
        },
        created() {
            this.hidden = this.popup.options.showAnimated;

            this.popup.show = animated => {
                if (animated) {
                    return this.showAnimated();
                } else {
                    this.hidden = false;
                    return new Promise(r => r());
                }
            };

            this.popup.hide = (animated) => {
                if (this.popup.component.hidePopupHandler !== undefined) {
                    this.popup.component.hidePopupHandler();
                }
                
                if (animated) {
                    return this.hideAnimated();
                } else {
                    this.hidden = true;
                    return new Promise(r => r());
                }
            };
        },
        mounted() {
            if (this.popup.options.showAnimated) {
                this.showAnimated();
            }
        },
        methods: {
            onHide() {
                /*if (this.popup.options.isBlocking) {
                    return;
                }

                this.$nav.back();*/
            },
            showAnimated() {
                return new Promise(resolve => {
                    this.hidden = false;
                    this.animationShow = true;

                    const handler = () => {
                        this.$refs.popup && this.$refs.popup.removeEventListener(animationEndEvent, handler);
                        this.animationShow = false;

                        resolve();

                        EventBus.$emit('set_popup_state', 'opened');
                    };

                    this.$refs.popup.addEventListener(animationEndEvent, handler);
                });
            },
            hideAnimated() {
                return new Promise(resolve => {
                    this.hidden = false;
                    this.animationHide = true;

                    const handler = () => {
                        this.$refs.popup && this.$refs.popup.removeEventListener(animationEndEvent, handler);
                        this.animationHide = false;
                        this.hidden = true;

                        resolve();

                        EventBus.$emit('set_popup_state', 'closed');
                    };

                    this.$refs.popup.addEventListener(animationEndEvent, handler);
                });
            }
        }
    }
</script>

