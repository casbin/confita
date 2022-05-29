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

	"github.com/casbin/confita/util"
	"github.com/donvito/zoom-go/zoomAPI"
)

var zoomClient zoomAPI.Client

func init() {
	zoomClient = zoomAPI.NewClient(zoomApiEndpoint, zoomJwtToken)
}

func addMeetingRegistrant(meetingNumber string, name string, displayName string, email string, affiliation string) string {
	var resp zoomAPI.AddMeetingRegistrantResponse
	var err error

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
		"",
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

	return resp.JoinUrl
}
