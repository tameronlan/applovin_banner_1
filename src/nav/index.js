import Vue from 'vue';
import store from '../store';
import VueRouter from "vue-router";

import Start from "@/components/Start";

Vue.use(VueRouter);

const vueNav = new VueRouter({
    baseURL: '/app/'
}, [
    {
        name: 'root',
        path: '/',
        component: Start,
    },
]);

store.registerModule('nav', {
    state: {
        record: null,
        intent: null
    }
});

export default vueNav;
