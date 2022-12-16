
const { localStorage } = window;

export const getItem = (key) => {
    let r;
    try {
        r = JSON.parse(localStorage.getItem(key));
    } catch(e) {
        console.error(e);
    }
    return r;
};

export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch(e) {
        console.error(e);
    }
};

