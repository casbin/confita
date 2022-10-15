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

func (c *ApiController) GetGlobalCodes() {
	c.Data["json"] = object.GetGlobalCodes()
	c.ServeJSON()
}

func (c *ApiController) GetCodes() {
	owner := c.Input().Get("owner")

	c.Data["json"] = object.GetCodes(owner)
	c.ServeJSON()
}

func (c *ApiController) GetCode() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetCode(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateCode() {
	id := c.Input().Get("id")

	var code object.Code
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &code)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateCode(id, &code)
	c.ServeJSON()
}

func (c *ApiController) AddCode() {
	var code object.Code
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &code)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddCode(&code)
	c.ServeJSON()
}

func (c *ApiController) DeleteCode() {
	var code object.Code
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &code)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteCode(&code)
	c.ServeJSON()
}
