export default class BufferedDataSource {
    constructor(buffer, autoload) {
        this.buffer = buffer || [];
        this.autoload = autoload;
        this.loading = false;
        this.waiters = [];
        this.broken = false;
        this.previousBufferIds = {};

        for (let object of this.buffer) {
            this.previousBufferIds[object.id] = true
        }
    }

    getNextItem(resolver) {
        if (this.loading) {
            const promise = new Promise((resolve, reject) => {
                this.waiters.push({ resolve, reject })
            });

            resolver({
                status: 'loading',
                promise: promise
            })
        } else if (this.broken && !this.buffer.length) {
            resolver({
                status: 'broken'
            })
        } else if (this.buffer.length) {
            resolver({
                status: 'default',
                item: this.buffer.shift()
            });

            if (!this.buffer.length && this.autoload && !this.broken) {
                this._load()
            }
        } else {
            const promise = new Promise((resolve, reject) => {
                this.waiters.push({ resolve, reject })
            });

            resolver({
                status: 'loading',
                promise: promise
            });

            this._load()
        }
    }

    load(page) {
        throw Error('BufferedDataSource: load() method desn\'t implemented')
    }

    _load() {
        if (this.loading) {
            return
        }

        this.loading = true;

        this.load(++this.page).then(data => {
            this.loading = false;

            for (let object of data.buffer) {
                if (!this.previousBufferIds[this.getCandidateId(object)]) {
                    this.buffer.push(object);
                }
            }

            this.previousBufferIds = {};

            for (let object of data.buffer) {
                this.previousBufferIds[this.getCandidateId(object)] = true;
            }

            this.broken = !data.hasNext;
            this._onLoadSuccess()
        }).catch(() => {
            this.loading = false;
            this.broken = true;
            this._onLoadFail()
        })
    }

    getCandidateId(candidate){
        return candidate.id
    }

    _onLoadSuccess() {
        while (this.buffer.length && this.waiters.length) {
            const item = this.buffer.shift();
            const waiter = this.waiters.shift();

            waiter.resolve(item)
        }

        if (this.waiters.length) {
            this._load()
        }
    }

    _onLoadFail() {
        for (let i = 0; i < this.waiters.length; i++) {
            this.waiters[i].reject()
        }

        this.waiters = []
    }
    
}
