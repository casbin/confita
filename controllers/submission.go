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
