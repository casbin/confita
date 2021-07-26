package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"

	"github.com/confita/confita/object"
	"github.com/confita/confita/oss"
)

func (c *ApiController) GetResources() {
	owner := c.Input().Get("owner")

	c.Data["json"] = object.GetResources(owner)
	c.ServeJSON()
}

func (c *ApiController) GetResource() {
	id := c.Input().Get("id")

	c.Data["json"] = object.GetResource(id)
	c.ServeJSON()
}

func (c *ApiController) UpdateResource() {
	id := c.Input().Get("id")

	var resource object.Resource
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &resource)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.UpdateResource(id, &resource)
	c.ServeJSON()
}

func (c *ApiController) AddResource() {
	var resource object.Resource
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &resource)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.AddResource(&resource)
	c.ServeJSON()
}

func (c *ApiController) DeleteResource() {
	var resource object.Resource
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &resource)
	if err != nil {
		panic(err)
	}

	c.Data["json"] = object.DeleteResource(&resource)
	c.ServeJSON()
}

func getFileBytes(file *multipart.File) []byte {
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, *file); err != nil {
		panic(err)
	}

	return buf.Bytes()
}

func (c *ApiController) UploadResource() {
	var resp Response

	owner := c.GetSessionUsername()

	file, header, err := c.Ctx.Request.FormFile("file")
	if err != nil {
		panic(err)
	}
	filename := header.Filename

	fileBytes := getFileBytes(&file)

	url, objectKey := oss.UploadFileAndGetLink("resources", owner, filename, fileBytes)
	resp = Response{Status: "ok", Msg: url, Data: len(fileBytes), Data2: objectKey}

	c.Data["json"] = resp
	c.ServeJSON()
}
