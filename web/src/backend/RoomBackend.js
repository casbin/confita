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

export function getGlobalRooms() {
  return fetch(`${Setting.ServerUrl}/api/get-global-rooms`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getRooms(owner) {
  return fetch(`${Setting.ServerUrl}/api/get-rooms?owner=${owner}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getRoom(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/get-room?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function updateRoom(owner, name, room) {
  let newRoom = Setting.deepCopy(room);
  return fetch(`${Setting.ServerUrl}/api/update-room?id=${owner}/${encodeURIComponent(name)}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newRoom),
  }).then(res => res.json());
}

export function addRoom(room) {
  let newRoom = Setting.deepCopy(room);
  return fetch(`${Setting.ServerUrl}/api/add-room`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newRoom),
  }).then(res => res.json());
}

export function deleteRoom(room) {
  let newRoom = Setting.deepCopy(room);
  return fetch(`${Setting.ServerUrl}/api/delete-room`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newRoom),
  }).then(res => res.json());
}

export function registerRoom(owner, name) {
  return fetch(`${Setting.ServerUrl}/api/register-room?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}
