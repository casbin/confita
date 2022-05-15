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
)

func (c *ApiController) GetGlobalRooms() {
	c.Data["json"] = object.GetGlobalRooms()
	c.ServeJSON()
}

func (c *ApiController) GetRooms() {
	owner := c.Input().Get("owner")

	c.Data["json"] = object.GetRooms(owner)
	c.ServeJSON()
}

func (c *ApiController) GetRoom() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetRoom(id)
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

func (c *ApiController) JoinRoom() {
	id := c.Input().Get("id")

	user := c.GetSessionUser()
	if user == nil {
		c.Data["json"] = false
		c.ServeJSON()
	}

	c.Data["json"] = object.JoinRoom(id, user)
	c.ServeJSON()
}

func (c *ApiController) LeaveRoom() {
	id := c.Input().Get("id")

	user := c.GetSessionUser()
	if user == nil {
		c.Data["json"] = false
		c.ServeJSON()
	}

	c.Data["json"] = object.LeaveRoom(id, user)
	c.ServeJSON()
}
