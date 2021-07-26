import * as Setting from "../Setting";

export function getResources(owner) {
  return fetch(`${Setting.ServerUrl}/api/get-resources?owner=${owner}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getResource(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/get-resource?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateResource(owner, name, resource) {
  let newResource = Setting.deepCopy(resource);
  newResource.ticket = JSON.stringify(resource.ticket);
  return fetch(`${Setting.ServerUrl}/api/update-resource?id=${owner}/${encodeURIComponent(name)}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newResource),
  }).then(res => res.json());
}

export function addResource(resource) {
  let newResource = Setting.deepCopy(resource);
  newResource.ticket = JSON.stringify(resource.ticket);
  return fetch(`${Setting.ServerUrl}/api/add-resource`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newResource),
  }).then(res => res.json());
}

export function deleteResource(resource) {
  let newResource = Setting.deepCopy(resource);
  newResource.ticket = JSON.stringify(resource.ticket);
  return fetch(`${Setting.ServerUrl}/api/delete-resource`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newResource),
  }).then(res => res.json());
}
