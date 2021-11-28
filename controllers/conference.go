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

package controllers

import (
	"encoding/json"

	"github.com/casbin/confita/object"
)

func (c *ApiController) GetGlobalConferences() {
	c.Data["json"] = object.GetGlobalConferences()
	c.ServeJSON()
}

func (c *ApiController) GetConferences() {
	owner := c.Input().Get("owner")

	c.Data["json"] = object.GetConferences(owner)
	c.ServeJSON()
}

func (c *ApiController) GetConference() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetConference(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateConference() {
	id := c.Input().Get("id")

	var conference object.Conference
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &conference)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateConference(id, &conference)
	c.ServeJSON()
}

func (c *ApiController) AddConference() {
	var conference object.Conference
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &conference)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddConference(&conference)
	c.ServeJSON()
}

func (c *ApiController) DeleteConference() {
	var conference object.Conference
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &conference)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteConference(&conference)
	c.ServeJSON()
}
