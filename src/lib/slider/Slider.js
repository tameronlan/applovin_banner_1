import { GestureRecognizer, GestureHandler, Gesture } from 'gestures';
import SliderCard from './SliderCard';
import Queue from '@/lib/Queue';

export default class Slider {
    static get HORIZONTAL() { return 'horizontal'; }
    static get VERTICAL() { return 'vertical'; }

    constructor(
        {
            dataSource, el, cardElPrev, cardElCenter, cardElNext, swapObjectInWrapper,
            willMoveTo, didMoveTo, onSwipeBack, onSwipeNext, direction = Slider.HORIZONTAL
        }
    ) {
        this.queue = new Queue();
        this.animating = false;
        this.cardsDeltaTmp = 0;
        this.direction = direction;
        this.scrollSize = this.direction === Slider.HORIZONTAL ? el.clientWidth : el.clientHeight;
        this.dataSource = dataSource;
        this.cardPrev = new SliderCard(cardElPrev, this.direction);
        this.cardCenter = new SliderCard(cardElCenter, this.direction);
        this.cardNext = new SliderCard(cardElNext, this.direction);
        this.swapObjectInWrapper = swapObjectInWrapper;
        this.didMoveTo = didMoveTo;
        this.willMoveTo = willMoveTo;
        this.onSwipeBack = onSwipeBack;
        this.onSwipeNext = onSwipeNext;

        this.isDisabled = false;

        this.cardPrev.move(-this.scrollSize);
        this.cardNext.move(this.scrollSize);

        const [ objPrev, objCenter, objNext ] = this.dataSource.getInitial();

        this.currentObject = objCenter;

        this.swapObjectInWrapper(this.cardPrev.el,   objPrev);
        this.swapObjectInWrapper(this.cardCenter.el, objCenter);
        this.swapObjectInWrapper(this.cardNext.el,   objNext);

        this.willMoveTo({
            to: objCenter,
            from: null,
            forwards: false,
            initial: true
        });

        this.didMoveTo({
            to: objCenter,
            from: null,
            forwards: false,
            initial: true
        });

        this.gestureRecognizer = new GestureRecognizer(el);
        this.gestureRecognizer.preventDefaultAnyway = false; // Fix profile vertical scrolling

        let slideHandler = new GestureHandler();
        slideHandler.onStart = gesture => {};

        slideHandler.onMove = gesture => {
            if (this.isDisabled) {
                return;
            }

            if (this.animating) {
                return;
            }

            let delta = this.direction === Slider.HORIZONTAL ? gesture.getDiffX() : gesture.getDiffY();

            if ((delta > 0 && !this.hasPrev) || (delta < 0 && !this.hasNext)) {
                return;
            }

            this.moveCards(delta);
            this.cardsDeltaTmp = delta;
        };

        slideHandler.onEnd = () => {
            if (this.isDisabled) {
                return;
            }

            if (this.animating) {
                return;
            }

            var delta = this.cardsDeltaTmp;

            if (delta >= 0 && delta < 10) {
                this.bounce();
            } else if (delta < 0) {
                if (this.hasNext) {
                    if (this.onSwipeNext) {
                        this.onSwipeNext({
                            from: this.currentObject,
                            to: this.dataSource.getNext(this.currentObject)
                        });
                    }
                    this.moveNext();
                }
                else {
                    this.bounce();
                }
            } else {
                if (this.hasPrev) {
                    if (this.onSwipeBack) {
                        this.onSwipeBack({
                            from: this.currentObject,
                            to: this.dataSource.getPrev(this.currentObject)
                        });
                    }
                    this.moveBack();
                } else {
                    this.bounce();
                }
            }

            this.cardsDeltaTmp = 0;
        }

        this.gestureRecognizer.addHandler(this.direction === Slider.HORIZONTAL? Gesture.TYPE_HORISONTAL : Gesture.TYPE_VERTICAL, slideHandler);
    }

    switchDataSource(newDataSource) {
        this.queue.next(next => {
            this.dataSource = newDataSource;

            const [objPrev, objCenter, objNext] = this.dataSource.getInitial();

            this.currentObject = objCenter;

            this.swapObjectInWrapper(this.cardPrev.el, objPrev);
            this.swapObjectInWrapper(this.cardCenter.el, objCenter);
            this.swapObjectInWrapper(this.cardNext.el, objNext);

            this.willMoveTo({
                to: objCenter,
                from: null,
                forwards: false,
                initial: true
            });

            this.didMoveTo({
                to: objCenter,
                from: null,
                forwards: false,
                initial: true
            });

            next();
        });
    }

    get hasPrev() {
        return this.dataSource.hasPrev(this.currentObject)
    }

    get hasNext() {
        return this.dataSource.hasNext(this.currentObject)
    }

    moveCards(delta) {
        if (this.hasPrev) {
            this.cardPrev.move(-this.scrollSize + delta)
        }

        this.cardCenter.move(delta)

        if (this.hasNext) {
            this.cardNext.move(this.scrollSize + delta)
        }
    }

    bounce() {
        this.queue.next(next => {
            this.animating = true;

            Promise.all([
                this.cardPrev.move(-this.scrollSize, true),
                this.cardCenter.move(0, true),
                this.cardNext.move(this.scrollSize, true)
            ]).then(() => {
                this.animating = false;
                next();
            });
        });
    }

    moveBack() {
        return new Promise(resolve => {
            this.queue.next(next => {
                if (!this.hasPrev) {
                    next();
                    resolve();
                    return;
                }

                this.animating = true;

                let prevObj = this.dataSource.getPrev(this.currentObject);

                this.willMoveTo({
                    to: prevObj,
                    from: this.currentObject,
                    forwards: false
                });

                Promise.all([
                    this.cardCenter.move(this.scrollSize, true),
                    this.cardPrev.move(0, true)
                ]).then(() => {
                    var wasPrev = this.cardPrev
                    var wasCenter = this.cardCenter
                    var wasNext = this.cardNext

                    this.cardPrev = wasNext
                    this.cardCenter = wasPrev
                    this.cardNext = wasCenter

                    this.cardPrev.move(-this.scrollSize)

                    this.dataSource.loadPrev(prevObj);

                    this.swapObjectInWrapper(this.cardPrev.el, this.dataSource.getPrev(prevObj));
                    this.swapObjectInWrapper(this.cardCenter.el, prevObj);
                    this.swapObjectInWrapper(this.cardNext.el, this.currentObject);

                    const oldCurrentObj = this.currentObject;
                    this.currentObject = prevObj;

                    this.didMoveTo({
                        to: this.currentObject,
                        from: oldCurrentObj,
                        forwards: false
                    });

                    this.animating = false;
                    next();
                    resolve();
                });
            });
        });
    }

    moveNext() {
        return new Promise(resolve => {
            this.queue.next(next => {
                if (!this.hasNext) {
                    next();
                    resolve();
                    return;
                }

                this.animating = true;

                let nextObj = this.dataSource.getNext(this.currentObject);

                this.willMoveTo({
                    to: nextObj,
                    from: this.currentObject,
                    forwards: true
                });

                Promise.all([
                    this.cardCenter.move(-this.scrollSize, true),
                    this.cardNext.move(0, true)
                ]).then(() => {
                    var wasPrev   = this.cardPrev;
                    var wasCenter = this.cardCenter;
                    var wasNext   = this.cardNext;

                    this.cardPrev   = wasCenter;
                    this.cardCenter = wasNext;
                    this.cardNext   = wasPrev;

                    this.cardNext.move(this.scrollSize);

                    this.dataSource.loadNext(nextObj);

                    this.swapObjectInWrapper(this.cardPrev.el, this.currentObject);
                    this.swapObjectInWrapper(this.cardCenter.el, nextObj);
                    this.swapObjectInWrapper(this.cardNext.el, this.dataSource.getNext(nextObj));

                    const oldCurrentObj = this.currentObject;
                    this.currentObject = nextObj;

                    this.didMoveTo({
                        to: this.currentObject,
                        from: oldCurrentObj,
                        forwards: true
                    });

                    this.animating = false;
                    next();
                    resolve();
                });
            });
        });
    }

    enable() {
        this.isDisabled = false;
    }

    disable() {
        this.isDisabled = true;
    }
}
