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
