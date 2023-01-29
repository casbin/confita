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
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"

	"github.com/astaxie/beego"
	"github.com/casbin/confita/util"
	"github.com/casdoor/casdoor-go-sdk/auth"
)

type Session struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	Application string `xorm:"varchar(100) notnull pk default ''" json:"application"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	SessionId []string `json:"sessionId"`
}

func addUserSession(org string, app string, userName string, sessionId string) {
	session := &Session{
		Owner:       org,
		Name:        userName,
		Application: app,
		SessionId:   []string{sessionId},
		CreatedTime: util.GetCurrentTime(),
	}

	postBytes, _ := json.Marshal(session)

	doPost("add-user-session", nil, postBytes, false)
}

func clearUserDuplicated(org string, app string, userName string) {
	session := &Session{
		Owner:       org,
		Name:        userName,
		Application: app,
	}

	postBytes, _ := json.Marshal(session)

	doPost("delete-user-session", nil, postBytes, false)
}

func isUserSessionDuplicated(org string, app string, userName string, sessionId string) bool {
	queryMap := map[string]string{
		"owner":       org,
		"name":        userName,
		"application": app,
		"sessionId":   sessionId,
	}

	url := auth.GetUrl("is-user-session-duplicated", queryMap)

	resp, _ := doGetResponse(url)

	return resp.Data == true
}

func doPost(action string, queryMap map[string]string, postBytes []byte, isFile bool) (*Response, error) {
	client := &http.Client{}
	url := auth.GetUrl(action, queryMap)

	var resp *http.Response
	var err error
	var contentType string
	var body io.Reader
	if isFile {
		contentType, body, err = createForm(map[string][]byte{"file": postBytes})
		if err != nil {
			return nil, err
		}
	} else {
		contentType = "text/plain;charset=UTF-8"
		body = bytes.NewReader(postBytes)
	}

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return nil, err
	}

	clientId := beego.AppConfig.String("clientId")
	clientSecret := beego.AppConfig.String("clientSecret")

	req.SetBasicAuth(clientId, clientSecret)
	req.Header.Set("Content-Type", contentType)

	resp, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	respByte, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response Response
	err = json.Unmarshal(respByte, &response)
	if err != nil {
		return nil, err
	}

	return &response, nil
}

func createForm(formData map[string][]byte) (string, io.Reader, error) {
	// https://tonybai.com/2021/01/16/upload-and-download-file-using-multipart-form-over-http/

	body := new(bytes.Buffer)
	w := multipart.NewWriter(body)
	defer w.Close()

	for k, v := range formData {
		pw, err := w.CreateFormFile(k, "file")
		if err != nil {
			panic(err)
		}

		_, err = pw.Write(v)
		if err != nil {
			panic(err)
		}
	}

	return w.FormDataContentType(), body, nil
}

func doGetResponse(url string) (*Response, error) {
	respBytes, err := auth.DoGetBytesRaw(url)

	var response Response
	err = json.Unmarshal(respBytes, &response)
	if err != nil {
		return nil, err
	}

	if response.Status != "ok" {
		return nil, fmt.Errorf(response.Msg)
	}

	return &response, nil
}
