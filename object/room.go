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
	"xorm.io/core"
)

type Participant struct {
	Name        string `xorm:"varchar(100)" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`
	Email       string `xorm:"varchar(100)" json:"email"`
	Affiliation string `xorm:"varchar(100)" json:"affiliation"`
	Tag         string `xorm:"varchar(100)" json:"tag"`
	Role        string `xorm:"varchar(100)" json:"role"`
	JoinUrl     string `xorm:"varchar(500)" json:"joinUrl"`
}

type Room struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`

	Conference string `xorm:"varchar(100)" json:"conference"`

	SdkKey        string `xorm:"varchar(100)" json:"sdkKey"`
	Signature     string `xorm:"varchar(1000)" json:"signature"`
	MeetingNumber string `xorm:"varchar(100)" json:"meetingNumber"`
	Passcode      string `xorm:"varchar(100)" json:"passcode"`
	InviteLink    string `xorm:"varchar(100)" json:"inviteLink"`

	Participants []*Participant `xorm:"mediumtext" json:"participants"`
	Status       string         `xorm:"varchar(100)" json:"status"`
}

func GetGlobalRooms() []*Room {
	rooms := []*Room{}
	err := adapter.engine.Desc("created_time").Find(&rooms, &Room{})
	if err != nil {
		panic(err)
	}

	return rooms
}

func GetRooms(owner string) []*Room {
	rooms := []*Room{}
	err := adapter.engine.Desc("created_time").Find(&rooms, &Room{Owner: owner})
	if err != nil {
		panic(err)
	}

	return rooms
}

func getRoom(owner string, name string) *Room {
	room := Room{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&room)
	if err != nil {
		panic(err)
	}

	if existed {
		return &room
	} else {
		return nil
	}
}

func GetRoom(id string) *Room {
	owner, name := util.GetOwnerAndNameFromId(id)

	room := getRoom(owner, name)
	if room != nil && room.MeetingNumber != "" {
		room.Signature = generateSignature(room.MeetingNumber, "1")
	}

	return room
}

func UpdateRoom(id string, room *Room) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getRoom(owner, name) == nil {
		return false
	}

	room.updateRoomRegistrants()

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(room)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func (p *Room) GetId() string {
	return fmt.Sprintf("%s/%s", p.Owner, p.Name)
}

func AddRoom(room *Room) bool {
	affected, err := adapter.engine.Insert(room)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteRoom(room *Room) bool {
	affected, err := adapter.engine.ID(core.PK{room.Owner, room.Name}).Delete(&Room{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func (room *Room) updateRoomRegistrants() {
	for _, participant := range room.Participants {
		if participant.JoinUrl == "" {
			joinUrl := addMeetingRegistrant(room.MeetingNumber, participant.Name, participant.DisplayName, participant.Email, participant.Affiliation)
			participant.JoinUrl = joinUrl
		}
	}
}
