import * as Setting from "../Setting";

export function getSubmissions(owner) {
  return fetch(`${Setting.ServerUrl}/api/get-submissions?owner=${owner}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getSubmission(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/get-submission?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateSubmission(owner, name, submission) {
  let newSubmission = Setting.deepCopy(submission);
  return fetch(`${Setting.ServerUrl}/api/update-submission?id=${owner}/${encodeURIComponent(name)}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newSubmission),
  }).then(res => res.json());
}

export function addSubmission(submission) {
  let newSubmission = Setting.deepCopy(submission);
  return fetch(`${Setting.ServerUrl}/api/add-submission`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newSubmission),
  }).then(res => res.json());
}

export function deleteSubmission(submission) {
  let newSubmission = Setting.deepCopy(submission);
  return fetch(`${Setting.ServerUrl}/api/delete-submission`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newSubmission),
  }).then(res => res.json());
}
