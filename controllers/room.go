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

package controllers

import (
	"encoding/json"

	"github.com/casbin/confita/object"
	"github.com/casdoor/casdoor-go-sdk/auth"
)

func (c *ApiController) GetGlobalRooms() {
	isPublic := c.Input().Get("isPublic")
	if isPublic != "1" {
		if c.RequireSignedIn() {
			return
		}
	}

	rooms := object.GetGlobalRooms()

	if isPublic == "1" {
		rooms = object.GetPublicRooms(rooms)
	}

	user := c.GetSessionUser()
	if isPublic == "1" && !user.IsAdmin {
		if user == nil {
			user = &auth.User{Name: ""}
		}
		rooms = object.GetMaskedRooms(rooms, user.Name)
	}
	rooms = object.GetRoomsWithLive(rooms)

	c.Data["json"] = rooms
	c.ServeJSON()
}

func (c *ApiController) GetRooms() {
	if c.RequireSignedIn() {
		return
	}

	owner := c.Input().Get("owner")

	rooms := object.GetRooms(owner)

	user := c.GetSessionUser()
	if !user.IsAdmin {
		rooms = object.GetMaskedRooms(rooms, user.Name)
	}
	rooms = object.GetRoomsWithLive(rooms)

	c.Data["json"] = rooms
	c.ServeJSON()
}

func (c *ApiController) GetRoom() {
	//if c.RequireSignedIn() {
	//	return
	//}

	id := c.Input().Get("id")

	room := object.GetRoom(id)

	user := c.GetSessionUser()
	if user == nil {
		user = &auth.User{Name: ""}
	}
	if !user.IsAdmin {
		room = object.GetMaskedRoom(room, user.Name)
	}
	room = object.GetRoomWithLive(room)

	c.Data["json"] = room
	c.ServeJSON()
}

func (c *ApiController) UpdateRoom() {
	id := c.Input().Get("id")

	var room object.Room
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &room)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateRoom(id, &room)
	c.ServeJSON()
}

func (c *ApiController) AddRoom() {
	var room object.Room
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &room)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddRoom(&room)
	c.ServeJSON()
}

func (c *ApiController) DeleteRoom() {
	var room object.Room
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &room)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteRoom(&room)
	c.ServeJSON()
}

func (c *ApiController) RegisterRoom() {
	if c.RequireSignedIn() {
		return
	}

	id := c.Input().Get("id")
	username := c.GetSessionUsername()

	c.Data["json"] = object.RegisterRoom(id, username)
	c.ServeJSON()
}
