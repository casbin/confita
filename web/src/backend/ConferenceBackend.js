import * as Setting from "../Setting";

export function getGlobalConferences() {
  return fetch(`${Setting.ServerUrl}/api/get-global-conferences`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getConferences(owner) {
  return fetch(`${Setting.ServerUrl}/api/get-conferences?owner=${owner}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getConference(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/get-conference?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateConference(owner, name, conference) {
  let newConference = Setting.deepCopy(conference);
  return fetch(`${Setting.ServerUrl}/api/update-conference?id=${owner}/${encodeURIComponent(name)}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newConference),
  }).then(res => res.json());
}

export function addConference(conference) {
  let newConference = Setting.deepCopy(conference);
  return fetch(`${Setting.ServerUrl}/api/add-conference`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newConference),
  }).then(res => res.json());
}

export function deleteConference(conference) {
  let newConference = Setting.deepCopy(conference);
  return fetch(`${Setting.ServerUrl}/api/delete-conference`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newConference),
  }).then(res => res.json());
}
