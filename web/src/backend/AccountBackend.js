import * as Setting from "../Setting";

export function getAccount() {
    return fetch(`${Setting.ServerUrl}/api/get-account`, {
        method: 'GET',
        credentials: 'include'
    }).then(res => res.json());
}

export function getUsers(owner) {
    return fetch(`${Setting.ServerUrl}/api/get-users?owner=${owner}`, {
        method: 'GET',
        credentials: 'include'
    }).then(res => res.json());
}

export function signin(code, state) {
    return fetch(`${Setting.ServerUrl}/api/signin?code=${code}&state=${state}`, {
        method: 'POST',
        credentials: 'include',
    }).then(res => res.json());
}

export function signout() {
    return fetch(`${Setting.ServerUrl}/api/signout`, {
        method: 'POST',
        credentials: "include",
    }).then(res => res.json());
}
