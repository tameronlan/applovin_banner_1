import Eventer from '@/lib/Eventer'

const push = new Eventer();

push.install = Vue => {
    Object.defineProperty(Vue.prototype, '$push', {
        get () {
            return push;
        }
    });
};

export default push;

