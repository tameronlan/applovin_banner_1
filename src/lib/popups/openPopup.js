import store from "../../store";
import vueNav from '@/nav/';

export function openPopup(popup, unloadOther = false) {
    return new Promise(resolve => {
        vueNav.nav.pushInstant({
            unloadOther: unloadOther,
            activate: animated => {
                store.dispatch('popups/openPopup', {popup, animated});
            },
            unload: (animated, options) => {
                store.dispatch('popups/closePopup', {
                    popup,
                    animated,
                    onClose: resolve(options)
                });
            }
        });
    });
}
