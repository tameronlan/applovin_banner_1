import SlideDataSource from './SliderDataSource';

export default class SliderDataSourceSet extends SlideDataSource {
    constructor({ items, initialId }) {
        super();

        this.initialId = initialId
        this.data = items;
        this._buildIndex();
    }
    _buildIndex() {
        this.index = {};
        for(var i = 0; i < this.data.length; i++) {
            this.index[this.data[i].id] = i;
        }
    }
    getInitial () {
        if (this.initialId) {
            let center = this.getById(this.initialId);
            let prev = this.hasPrev(center) ? this.getPrev(center) : undefined;
            let next = this.hasNext(center) ? this.getNext(center) : undefined;
            return [prev, center, next];
        } else {
            return [undefined, ...this.data.slice(0, 2)];
        }
    }
    getTotal() {
        return this.data.length;
    }
    getItemNumById(id) {
        return this.index[id] + 1;
    }
    hasPrev(object) {
        return this.index[object.id] > 0;
    }
    hasNext(object) {
        return this.index[object.id] < (this.data.length-1);
    }
    getById(id) {
        return this.data[this.index[id]];
    }
    getPrev(object) {
        return this.data[this.index[object.id] - 1];
    }
    getNext(object) {
        return this.data[this.index[object.id] + 1];
    }
};

