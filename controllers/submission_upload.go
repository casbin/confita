package controllers

import "github.com/confita/confita/oss"

func (c *ApiController) UploadSubmissionFile() {
	var resp Response

	owner := c.GetSessionUsername()

	file, header, err := c.Ctx.Request.FormFile("file")
	if err != nil {
		panic(err)
	}
	filename := header.Filename

	fileBytes := getFileBytes(&file)

	url, objectKey := oss.UploadFileAndGetLink("submissions", owner, filename, fileBytes)
	resp = Response{Status: "ok", Msg: url, Data: len(fileBytes), Data2: objectKey}

	c.Data["json"] = resp
	c.ServeJSON()
}
