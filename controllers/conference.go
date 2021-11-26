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
