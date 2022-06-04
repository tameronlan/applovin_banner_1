import serverTime from './serverTime';

let intervalId = 0;
let callbacks = [];
let isRunning = false;
const TIMEOUT = 1000;

export default {
    isActive(cb) {
        return callbacks.indexOf(cb) !== -1;
    },
    addCallback(cb) {
        if (this.isActive(cb)) {
            return;
        }

        if (!isRunning) {
            this.start();
        }

        callbacks.push(cb);
        cb(serverTime.getActualTime());
    },
    removeCallback(cb) {
        if (!this.isActive(cb)) {
            return;
        }

        for (var i = callbacks.length - 1; i >= 0; i--) {
            if (callbacks[i] === cb) {
                callbacks.splice(i, 1);
                break;
            }
        }

        if (isRunning && callbacks.length === 0) {
            this.stop();
        }
    },
    start() {
        isRunning = true;
        intervalId = setInterval(this.timerHandler, TIMEOUT);
    },
    stop() {
        isRunning = false;
        clearInterval(intervalId);
    },
    timerHandler() {
        let time = serverTime.getActualTime();

        for (let i = callbacks.length - 1; i >= 0; i--) {
            callbacks[i](time);
        }
    }
}