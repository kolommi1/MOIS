import Cookies from 'js-cookie'

export const getToken = () => {
    const jwt = Cookies.get('token');
    let session;
    try {
        if (jwt) {
            const base64Url = jwt.split('.')[1];
            if(base64Url) {
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                // what is window.atob ?
                // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
                session = JSON.parse(window.atob(base64));
            }
        }
    } catch (error) {
        console.log(error);
    }
    return session;
};

export const logout = () => {
    Cookies.remove('token');
};