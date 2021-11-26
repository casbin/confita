package controllers

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"

	"github.com/casbin/confita/service"
)

func getFileBytes(file *multipart.File) []byte {
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, *file); err != nil {
		panic(err)
	}

	return buf.Bytes()
}

func (c *ApiController) UploadSubmissionFile() {
	var resp Response

	owner := c.GetSessionUsername()

	file, header, err := c.Ctx.Request.FormFile("file")
	if err != nil {
		panic(err)
	}
	filename := header.Filename

	fileBytes := getFileBytes(&file)

	fileUrl, objectKey := service.UploadFileToStorage(owner, "file", "UploadSubmissionFile", fmt.Sprintf("confita/file/%s/%s/%s", owner, "submissions", filename), fileBytes)
	resp = Response{Status: "ok", Msg: fileUrl, Data: len(fileBytes), Data2: objectKey}

	c.Data["json"] = resp
	c.ServeJSON()
}
