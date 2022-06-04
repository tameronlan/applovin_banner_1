import getVendorPrefix from '../getVendorPrefix';
import Slider from './Slider';

export default class SliderCard {
    constructor(element, direction = Slider.HORIZONTAL) {
        this.el = element;
        this.direction = direction;
        this.pos = 0;
        this.animationTime = 0.3; // sec
        this.prefix = getVendorPrefix('transform');
        this.styleTransform = this.prefix + 'transform'
        this.styleTransition = this.prefix + 'transition';
        this.updateSizes();
    }
    onResize() {
        this.updateSizes();
    }
    updateSizes() {
        this.size = this.direction === Slider.HORIZONTAL ? this.el.clientWidth : this.el.clientHeight;
    }
    move(newPos, animated) {
        return new Promise((resolve, reject) => {
            var delta = Math.abs(newPos - this.pos);
            this.pos = newPos;
            var animationTime;

            if (animated) {
                animationTime = delta / this.size * this.animationTime;
                this.el.style[this.styleTransition] = 'all ease-in-out '+animationTime.toFixed(3)+'s';
            }

            var posX = this.direction === Slider.HORIZONTAL ? this.pos : 0;
            var posY = this.direction === Slider.VERTICAL ? this.pos : 0;
            this.el.style[this.styleTransform] = `translate3d(${posX}px, ${posY}px, 0)`;

            if (animated) {
                setTimeout(function() {
                    this.el.style[this.styleTransition] = 'none';
                    resolve();
                }.bind(this), parseFloat(animationTime.toFixed(3)) * 1000);
            } else {
                resolve();
            }
        })
    }
}