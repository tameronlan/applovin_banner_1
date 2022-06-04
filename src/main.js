import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {i18n} from './plugins/i18n';
import nav from './nav/';
import touchDirective from './lib/touchDirective';
import fileDirective from './lib/fileDirective';
import pluralFilter from './lib/pluralFilter';
import push from './push';
import ComponentView from './lib/ComponentView';
import { longClickDirective } from 'vue-long-click'
import Toasted from 'vue-toasted';

import './scss/main.scss';

Vue.config.productionTip = false;
// Vue.config.errorHandler = function(err, vm, info) {
//     console.log("err", err)
//     console.log("vm", vm)
//     console.log("info", info)
// }

const longClickInstance = longClickDirective({delay: 1000, interval: 0});

// Components
Vue.component('ComponentView', ComponentView);

// Directives
Vue.directive('touch', touchDirective);
Vue.directive('file-upload', fileDirective);
Vue.directive('longclick', longClickInstance);

// Filters
Vue.filter('plural', pluralFilter);

// Modules
Vue.use(push);
Vue.use(Toasted, {
    position: 'bottom-center',
    duration: 4000
});

// Wait for the SDK to become ready
if (window.mraid && mraid.getState() === 'loading') {
    mraid.addEventListener('ready', onSdkReady);
} else {
    onSdkReady();
}

function viewableChangeHandler(viewable) {
    if(viewable) {
        showMyAd();
    }
}
function onSdkReady() {
    if (!window.mraid){
        return;
    }

    mraid.addEventListener('viewableChange', viewableChangeHandler);
    mraid.addEventListener('viewableChange', viewableChangeHandler);

    if (mraid.isViewable()) {
        showMyAd();
    }
}

let showMyAd = () => {
    // alert("MRAD ready");
}

new Vue({
    el: '#app',
    store,
    i18n,
    nav: nav,
    render: h => h(App)
});
