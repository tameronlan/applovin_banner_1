let serverTime = 0;
let initialTimestamp = 0;

export default {
    init(time) {
        serverTime = time;
        initialTimestamp = new Date().getTime();
    },
    getActualTime() {
        let delta = (new Date().getTime() - initialTimestamp) / 1000;
        return Math.floor(serverTime + delta);
    }
}