export const animationEndEvent = (() => {
    const el = document.createElement('div');
    const animations = {
        'animation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
})();

const USER_AGENT_ANDROID = 'Vendor/Android';
const USER_AGENT_IOS = 'Vendor/iOS';

export function getVendor() {
    let userAgent = navigator.userAgent;

    if (userAgent.indexOf(USER_AGENT_IOS) !== -1) {
        return 1;
    } else if (userAgent.indexOf(USER_AGENT_ANDROID) !== -1) {
        return 2;
    } else {
        return 3;
    }
}

