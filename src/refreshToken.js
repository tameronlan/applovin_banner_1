import bridge from "./bridge";
import Cookie from "js-cookie";
import store from "./store";
import {refreshToken} from "./api/meeting";

export default function(){
    return new Promise((resolve, reject) => {
        if (bridge.isSupported()){
            refreshTokenThroughNative(resolve, reject)
        } else {
            refreshTokenThroughRequest(resolve, reject)
        }
    });
}

function saveToken(token){
    Cookie.set('token', token, {path: '/'});
    Cookie.set('access_token', token, {path: '/'});

    store.commit('common/setToken', token);
}

function saveSecret(secret){
    Cookie.set('secret', secret, {path: '/'});

    store.commit('common/setSecret', secret);
}

function refreshTokenThroughNative(resolve, reject){
    bridge.invokeNative('refresh_token', {}, response => {
        if (response === undefined){
            reject();

            return
        }

        if (response.token !== undefined) saveToken(response.token);

        if (response.secret !== undefined) saveSecret(response.secret);

        resolve(response);
    });
}

function refreshTokenThroughRequest(resolve, reject){
    refreshToken({
        refresh_secret: store.state.common.secret,
        app_id: store.state.common.appId,
        type: 4,
        adv_id: store.state.common.advId,
        track_id: store.state.common.trackId,
    }).then(response => {
        if (response === undefined){
            reject();

            return
        }

        if (response.token !== undefined) saveToken(response.token);
        if (response.secret !== undefined) saveSecret(response.secret);

        resolve(response);
    });
}

