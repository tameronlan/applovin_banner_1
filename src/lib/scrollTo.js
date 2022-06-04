export default function scrollTo(element, to, duration) {
    let start = element.scrollTop
    let target;

    if (typeof to === 'string' && to.substr(0, 2) === '+=') {
        let diff = parseInt(to.substr(2));
        target = start + diff;
    } else {
        target = to;
    }

    let change = target - start;
    let currentTime = 0;
    let increment = 20;

    let animateScroll = function() {
        currentTime += increment;

        let val = easeInOutQuad(currentTime, start, change, duration);

        requestAnimationFrame(() => {
            element.scrollTop = val;
        });

        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
function easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}
