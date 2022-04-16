// Copyright 2021 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Setting from "../Setting";

export function getGlobalSubmissions() {
  return fetch(`${Setting.ServerUrl}/api/get-global-submissions`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

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
