// src/utils/timing.js

export function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

export function debounce_leading(fn, delay) {
    let timer = null;

    return (...args) => {
        if(!timer)
            fn.apply(this, args);
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
        }, delay);
    }
}