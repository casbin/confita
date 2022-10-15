// Copyright 2022 The casbin Authors. All Rights Reserved.
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

export function getGlobalCodes() {
  return fetch(`${Setting.ServerUrl}/api/get-global-codes`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getCodes(owner) {
  return fetch(`${Setting.ServerUrl}/api/get-codes?owner=${owner}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getCode(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/get-code?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateCode(owner, name, code) {
  let newCode = Setting.deepCopy(code);
  return fetch(`${Setting.ServerUrl}/api/update-code?id=${owner}/${encodeURIComponent(name)}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newCode),
  }).then(res => res.json());
}

export function addCode(code) {
  let newCode = Setting.deepCopy(code);
  return fetch(`${Setting.ServerUrl}/api/add-code`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newCode),
  }).then(res => res.json());
}

export function deleteCode(code) {
  let newCode = Setting.deepCopy(code);
  return fetch(`${Setting.ServerUrl}/api/delete-code`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newCode),
  }).then(res => res.json());
}
