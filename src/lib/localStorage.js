export function lsSet(key, value) {
    if (typeof key === 'undefined') return;
    if (typeof value === 'undefined') return;
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;

    window.localStorage.setItem(key, `${value}`);
}

export function lsGet(key){
    if (typeof key === 'undefined') return 0;
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return 0;

    return window.localStorage.getItem(key);
}

export function lsIsLock(key){
    if (typeof key === 'undefined') return false;
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return false;

    return Number(lsGet(key)) === 1;
}

export function lsLock(key){
    if (typeof key === 'undefined') return;

    return lsSet(key, 1);
}

export function lsSetIncrement(key) {
    if (typeof key === 'undefined') return;

    return lsSet(key, Number(lsGet(key)) + 1);
}

export function lsSetDecrement(key) {
    if (typeof key === 'undefined') return;

    return lsSet(key, Number(lsGet(key)) - 1);
}

export function lsUnlock(key){
    if (typeof key === 'undefined') return;
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;

    return lsSet(key, 0);
}

