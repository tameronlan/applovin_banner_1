<template>
    <div>
        <div v-if="show" class="push-notification-wrapper">
            <div class="push-notification" :class="[style]" @click="onClick" v-touch ref="notification">
                <div v-if="ava" class="push-notification__ava-wrapper">
                    <div class="push-notification__ava" :style="{ backgroundImage: `url(${ava})` }"></div>
                </div>
                <div class="push-notification__content">
                    <div v-if="title" class="push-notification__title  ellipsis" v-html="title"></div>
                    <div v-if="text" class="push-notification__text" v-html="text"></div>
                </div>
                <div v-if="ico" class="push-notification__ico-wrapper">
                    <div :class="ico"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import push from '@/push'
    import {Gesture, GestureHandler, GestureRecognizer} from 'gestures';
    import getVendorPrefix from '@/lib/getVendorPrefix';
    import Queue from '@/lib/Queue'

    export default {
        name: 'Push',
        data() {
            return {
                show: false,
                animating: false,
                notificationObj: null,
                ava: null,
                ico: null,
                title: null,
                text: null,
                style: null,
                touched: true
            }
        },
        //components: { RiseIconCheckSvg },
        created() {
            this.prefix = getVendorPrefix('transform');
            this.styleTransform = this.prefix + 'transform';
            this.styleTransition = this.prefix + 'transition';
            this.queue = new Queue();

            push.on('notification', this.handleNotification);
        },
        destroyed() {
            clearTimeout(this.autohideTimer);
        },
        methods: {
            onClick: function () {
                if (!this.notificationObj) {
                    return;
                }

                this.hideNotification();
            },
            moveNotification(y, animated) {
                let _this = this;

                return new Promise(resolve => {
                    if (animated) {
                        _this.animating = true;

                        setTimeout(() => {
                            _this.$refs.notification.style[_this.styleTransition] = 'all .3s ease-in-out';

                            setTimeout(() => {
                                _this.$refs.notification.style[_this.styleTransform] = `translate3d(0, ${y}, 0)`;

                                setTimeout(() => {
                                    _this.$refs.notification.style[_this.styleTransition] = 'none';
                                    _this.animating = false;
                                    resolve();
                                }, 350)
                            })
                        }, 50)
                    } else {
                        _this.$refs.notification.style[_this.styleTransform] = `translate3d(0, ${y}, 0)`;
                        resolve();
                    }
                })
            },
            hideNotification() {
                return new Promise(resolve => {
                    if (!this.show) {
                        resolve();
                        return;
                    }

                    this.moveNotification('-150%', true).then(() => {
                        this.show = false;
                        this.notificationObj = null;
                        this.ava = null;
                        this.title = null;
                        this.text = null;
                        this.ico = null;
                        this.style = null;

                        resolve();
                    })
                })
            },
            handleNotification(notification) {
                clearTimeout(this.autohideTimer);

                this.notificationObj = notification;

                switch (notification.type) {
                    case 'rating-rise':
                        this.handleNotificationRatingRise(notification.data);
                        break;
                    default:
                        this.handleNotificationSimpleText(notification.data);
                        break
                }
            },
            handleNotificationSimpleText(data) {
                this.queue.next(next => {
                    this.hideNotification().then(() => {
                        this.ava = data.ava;
                        this.title = data.title;
                        this.text = data.text;
                        this.ico = data.ico;
                        this.style = data.style;
                        this.show = true;
                        this.type = null;

                        this.moveNotification(0, true).then(() => {
                            this.setupGestures();
                            this.autohideTimer = setTimeout(() => {
                                this.hideNotification();
                            }, 4000);

                            next();
                        });
                    });
                });
            },
            handleNotificationRatingRise(data) {
                this.queue.next(next => {
                    this.hideNotification().then(() => {
                        this.ava = null;
                        this.title = data.title;
                        this.text = data.text;
                        this.ico = data.ico;
                        this.style = data.style;
                        this.show = true;
                        this.type = 'rating-rise';

                        this.moveNotification(0, true).then(() => {
                            this.setupGestures();
                            this.autohideTimer = setTimeout(() => {
                                this.hideNotification();
                            }, 4000);
                        });
                        next();
                    });
                });
            },
            setupGestures() {
                let _this = this;
                const handler = new GestureHandler();
                let queuePromiseResolve;
                let queuePromiseNext;

                handler.onStart = () => {
                    if (_this.animating) {
                        return
                    }
                    _this.touched = true;

                    // Busy queue to prevent shoing new notify
                    _this.queue.next(next => {
                        return new Promise(resolve => {
                            queuePromiseResolve = resolve;
                            queuePromiseNext = next;
                        })
                    })
                };

                handler.onMove = gesture => {
                    if (_this.animating) {
                        return;
                    }
                    let dy = gesture.getDiffY() * 0.4;
                    _this.moveNotification(`${dy}px`);
                };

                handler.onEnd = gesture => {
                    if (_this.animating) {
                        return;
                    }
                    let dy = gesture.getDiffY();
                    if (dy < 0) {
                        this.hideNotification().then(() => {
                            _this.touched = false;

                            if (queuePromiseResolve) {
                                queuePromiseResolve();
                                queuePromiseResolve = null;
                            }

                            if (queuePromiseNext) {
                                queuePromiseNext();
                            }
                        })
                    } else {
                        this.moveNotification(0, true).then(() => {
                            _this.touched = false;

                            if (queuePromiseResolve) {
                                queuePromiseResolve();
                                queuePromiseResolve = null;
                            }

                            if (queuePromiseNext) {
                                queuePromiseNext();
                            }
                        })
                    }
                };

                const recognizer = new GestureRecognizer(this.$refs.notification);
                recognizer.addHandler(Gesture.TYPE_VERTICAL, handler);
            }

        }
    }
</script>
