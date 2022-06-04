import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let defaultUserData = {
    id: 0
};

let store = new Vuex.Store({
    state: {
        users: []
    },
    getters: {

    },
    mutations: {
        setUsers(state, users){
            state.users = users
        },
        updateUser(state, user){
            let users = state.users

            users.forEach((mUser, index) => {
                if (mUser.id === user.id) {
                    mUser = user
                }
            })

            state.users = users
        }
    },
    actions: {

    },
    modules: {

    }
});

export default store;
