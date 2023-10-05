

export default function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
}