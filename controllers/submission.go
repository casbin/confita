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

func (c *ApiController) GetSubmissions() {
	owner := c.Input().Get("owner")

	c.Data["json"] = object.GetSubmissions(owner)
	c.ServeJSON()
}

func (c *ApiController) GetSubmission() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetSubmission(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateSubmission() {
	id := c.Input().Get("id")

	var submission object.Submission
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &submission)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateSubmission(id, &submission)
	c.ServeJSON()
}

func (c *ApiController) AddSubmission() {
	var submission object.Submission
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &submission)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddSubmission(&submission)
	c.ServeJSON()
}

func (c *ApiController) DeleteSubmission() {
	var submission object.Submission
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &submission)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteSubmission(&submission)
	c.ServeJSON()
}
