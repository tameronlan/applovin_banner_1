export default class Queue {
    constructor() {
        this.queue = [];
    }

    next(callback) {
        callback = makePromise(callback);

        this.queue.push(callback);

        if (this.queue.length === 1) {
            callback().then(this._next.bind(this));
        }
    }

    _next() {
        this.queue.shift();
        if (this.queue.length) {
            this.queue[0]().then(this._next.bind(this));
        }
    }

    clean() {
        this.queue = [];
    }
};

function makePromise(callback) {
    return function() {
        return new Promise(resolve => callback(resolve));
    }
}
