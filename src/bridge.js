import store from './store';
import EventBus from "@/lib/EventBus";

let methods = {};
let callbacks = {};
let uniqId = 0;

window.webviewBridgeJs = {
    invokeMethod(methodName, paramsObj) {
        console.log(`BRIDGE_JS: invokeMethod - ${methodName};`, paramsObj);

        if (typeof methods[methodName] == "function") {
            methods[methodName].call(this, paramsObj);
        }
    },
    callback(callbackId, paramsObj) {
        console.log(`BRIDGE_JS: callback - ${callbackId};`, paramsObj);

        if (typeof callbacks[callbackId] == "function") {
            callbacks[callbackId].call(this, paramsObj);

            delete callbacks[callbackId];
        }
    },
    goBack() {
        if (
            store.state.common.backNavEnabled &&
            !checkGoBackForSignupNative()
        ){
            EventBus.$emit("go_back");
            history.back();
        }
    }
};

function checkGoBackForSignupNative(){
    let res = store.state.common.enableNativePageSignup
                && (new RegExp('/signup_name', 'gi')).test(location.pathname);

    if (res) bridge.invokeNative('show_signup');

    return res;
}

let bridge = {
    registerMethod: function (methodName, fn) {
        methods[methodName] = fn;

        window.webviewBridgeJs[methodName] = fn; // Из-за ошибки в приложении
    },
    invokeNative: function (methodName, params = {}, callbackFn = null) {
        console.log(`BRIDGE: invokeNative - ${methodName};`, JSON.stringify(params), callbackFn);

        if (callbackFn) {
            callbacks[++uniqId] = callbackFn;
        }

        if (window.webviewBridgeNative && typeof window.webviewBridgeNative.invokeMethod == "function") {
            window.webviewBridgeNative.invokeMethod(
                methodName,
                JSON.stringify(params),
                callbackFn ? uniqId : 0
            );
        }
    },
    isSupported: function () {
        return !!window.webviewBridgeNative;
    }
};

export default bridge;
