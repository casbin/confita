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
	"encoding/json"
	"time"

	"github.com/casbin/confita/object"
)

type MeetingEvent struct {
	Event   string `json:"event"`
	Payload struct {
		AccountId string `json:"account_id"`
		Object    struct {
			Duration  int       `json:"duration"`
			StartTime time.Time `json:"start_time"`
			Timezone  string    `json:"timezone"`
			EndTime   time.Time `json:"end_time"`
			Topic     string    `json:"topic"`
			Id        string    `json:"id"`
			Type      int       `json:"type"`
			Uuid      string    `json:"uuid"`
			HostId    string    `json:"host_id"`
		} `json:"object"`
	} `json:"payload"`
	EventTs int64 `json:"event_ts"`
}

var messageMap map[string]int

func init() {
	messageMap = map[string]int{}
}

func (c *ApiController) WebhookRoom() {
	// https://developers.zoom.us/docs/api/rest/webhook-only-app/
	var event MeetingEvent
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &event)
	if err != nil {
		panic(err)
	}

	status := ""
	if event.Event == "webinar.started" {
		status = "Started"
	} else if event.Event == "webinar.ended" {
		status = "Ended"
	} else {
		c.Data["json"] = true
		c.ServeJSON()
		return
	}

	meetingNumber := event.Payload.Object.Id
	object.UpdateRoomStatus(meetingNumber, status)

	c.Data["json"] = true
	c.ServeJSON()
}
