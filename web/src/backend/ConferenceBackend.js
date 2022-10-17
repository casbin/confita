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

export function getGlobalConferences() {
  return fetch(`${Setting.ServerUrl}/api/get-global-conferences`, {
    method: "GET",
    credentials: "include",
  }).then(res => res.json());
}

export function getConferences(owner) {
  return fetch(`${Setting.ServerUrl}/api/get-conferences?owner=${owner}`, {
    method: "GET",
    credentials: "include",
  }).then(res => res.json());
}

export function getConference(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/get-conference?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include",
  }).then(res => res.json());
}

export function updateConference(owner, name, conference) {
  const newConference = Setting.deepCopy(conference);
  return fetch(`${Setting.ServerUrl}/api/update-conference?id=${owner}/${encodeURIComponent(name)}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(newConference),
  }).then(res => res.json());
}

export function addConference(conference) {
  const newConference = Setting.deepCopy(conference);
  return fetch(`${Setting.ServerUrl}/api/add-conference`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(newConference),
  }).then(res => res.json());
}

export function deleteConference(conference) {
  const newConference = Setting.deepCopy(conference);
  return fetch(`${Setting.ServerUrl}/api/delete-conference`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(newConference),
  }).then(res => res.json());
}
