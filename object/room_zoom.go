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

package object

import (
	"fmt"

	"github.com/casbin/confita/proxy"
	"github.com/casbin/confita/util"
	"github.com/nomeguy/zoom-go/zoomAPI"
)

var zoomClient zoomAPI.Client

func InitRoomClient() {
	zoomClient = zoomAPI.NewClient(zoomApiEndpoint, zoomJwtToken, proxy.ProxyHttpClient)
	zoomClient.IsWebinar = true
}

func getMeetingStartUrl(meetingNumber string) string {
	meetingId := util.ParseInt(meetingNumber)
	resp, err := zoomClient.GetMeeting(meetingId)
	if err != nil {
		panic(err)
	}

	return resp.StartUrl
}

func getMeetingRegistrantId(meetingNumber string, email string) string {
	meetingId := util.ParseInt(meetingNumber)

	resp, err := zoomClient.ListMeetingRegistrants(meetingId, "pending")
	if err != nil {
		panic(err)
	}

	for _, registrant := range resp.Registrants {
		if email == registrant.Email {
			return registrant.Id
		}
	}
	return ""
}

func approveMeetingRegistrant(meetingNumber string, email string) {
	id := getMeetingRegistrantId(meetingNumber, email)
	if id == "" {
		panic(fmt.Errorf("getMeetingRegistrantId() error, meetingNumber = %s, email = %s, id = %s", meetingNumber, email, id))
	}

	meetingId := util.ParseInt(meetingNumber)

	registrants := []zoomAPI.Registrant{{email, id}}
	err := zoomClient.UpdateMeetingRegistrantStatus(meetingId, "approve", registrants)
	if err != nil {
		panic(err)
	}
}

func addMeetingRegistrant(meetingNumber string, name string, displayName string, email string, affiliation string) string {
	var resp zoomAPI.AddMeetingRegistrantResponse
	var err error

	//if !util.IsChinese(name) {
	//	email = fmt.Sprintf("%s@example-nowhere.com", name)
	//} else {
	//	email = fmt.Sprintf("%s@example-nowhere.com", util.GenerateId()[:8])
	//}
	email = fmt.Sprintf("%s%s@example-nowhere.com", util.GenerateId()[:8], util.GenerateId()[:8])
	phone := fmt.Sprintf("186%s", util.GenerateNumber(10000000, 99999999))

	if displayName == "" {
		displayName = name
	}

	meetingId := util.ParseInt(meetingNumber)
	resp, err = zoomClient.AddMeetingRegistrant(meetingId,
		email,
		displayName,
		fmt.Sprintf("(%s)", name),
		"",
		"",
		"",
		"",
		"",
		phone,
		"",
		affiliation,
		"",
		"",
		"",
		"",
		"",
		nil)
	if err != nil {
		panic(err)
	}

	approveMeetingRegistrant(meetingNumber, email)

	addWebinarPanelist(meetingNumber, displayName, email)

	return resp.JoinUrl
}

func addWebinarPanelist(meetingNumber string, displayName string, email string) {
	panelist := zoomAPI.Panelist{
		Email: email,
		Name:  displayName,
	}
	panelists := []zoomAPI.Panelist{panelist}

	meetingId := util.ParseInt(meetingNumber)
	err := zoomClient.AddWebinarPanelists(meetingId, panelists)
	if err != nil {
		panic(err)
	}
}
