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
	"strings"
	"time"

	"github.com/casbin/confita/casdoor"
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

type Slot struct {
	Type      string `xorm:"varchar(100)" json:"type"`
	Date      string `xorm:"varchar(100)" json:"date"`
	StartTime string `xorm:"varchar(100)" json:"startTime"`
	EndTime   string `xorm:"varchar(100)" json:"endTime"`
	Title     string `xorm:"varchar(100)" json:"title"`
	Speaker   string `xorm:"varchar(100)" json:"speaker"`
	Location  string `xorm:"varchar(100)" json:"location"`
}

type Room struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`

	Conference string `xorm:"varchar(100)" json:"conference"`
	Speaker    string `xorm:"varchar(100)" json:"speaker"`
	Date       string `xorm:"varchar(100)" json:"date"`
	StartTime  string `xorm:"varchar(100)" json:"startTime"`
	EndTime    string `xorm:"varchar(100)" json:"endTime"`
	Location   string `xorm:"varchar(100)" json:"location"`
	ImageUrl   string `xorm:"varchar(100)" json:"imageUrl"`

	SdkKey        string `xorm:"varchar(100)" json:"sdkKey"`
	Signature     string `xorm:"varchar(1000)" json:"signature"`
	MeetingNumber string `xorm:"varchar(100)" json:"meetingNumber"`
	Passcode      string `xorm:"varchar(100)" json:"passcode"`
	InviteLink    string `xorm:"varchar(100)" json:"inviteLink"`
	StartUrl      string `xorm:"varchar(500)" json:"startUrl"`

	Participants []*Participant `xorm:"mediumtext" json:"participants"`
	Slots        []*Slot        `xorm:"mediumtext" json:"slots"`
	Status       string         `xorm:"varchar(100)" json:"status"`
	IsPublic     bool           `json:"isPublic"`

	IngestDomain           string `xorm:"varchar(100)" json:"ingestDomain"`
	IngestAuthKey          string `xorm:"varchar(100)" json:"ingestAuthKey"`
	StreamingDomain        string `xorm:"varchar(100)" json:"streamingDomain"`
	StreamingAuthKey       string `xorm:"varchar(100)" json:"streamingAuthKey"`
	MobileStreamingAuthKey string `xorm:"varchar(100)" json:"mobileStreamingAuthKey"`
	VideoWidth             int    `json:"videoWidth"`
	VideoHeight            int    `json:"videoHeight"`
	IsLive                 bool   `json:"isLive"`
	LiveUserCount          int    `json:"liveUserCount"`
	ViewerCount            int    `json:"viewerCount"`

	VideoUrl string `xorm:"varchar(255)" json:"videoUrl"`
}

func GetGlobalRooms() []*Room {
	rooms := []*Room{}
	err := adapter.engine.Desc("created_time").Find(&rooms, &Room{})
	if err != nil {
		panic(err)
	}

	for _, room := range rooms {
		room.updateRoomStartUrl()
	}

	return rooms
}

func GetRooms(owner string) []*Room {
	rooms := []*Room{}
	err := adapter.engine.Desc("created_time").Find(&rooms, &Room{Owner: owner})
	if err != nil {
		panic(err)
	}

	for _, room := range rooms {
		room.updateRoomStartUrl()
	}

	return rooms
}

func GetMaskedRoom(room *Room, username string) *Room {
	if room == nil {
		return nil
	}

	if room.SdkKey != "" {
		room.SdkKey = "***"
	}
	if room.Signature != "" {
		room.Signature = "***"
	}
	if room.MeetingNumber != "" {
		room.MeetingNumber = "***"
	}
	if room.Passcode != "" {
		room.Passcode = "***"
	}
	if room.InviteLink != "" {
		room.InviteLink = "***"
	}
	if room.StartUrl != "" {
		room.StartUrl = "***"
	}

	for _, participant := range room.Participants {
		if participant.Name != username {
			if participant.JoinUrl != "" {
				participant.JoinUrl = "***"
			}
		}
	}

	return room
}

func GetMaskedRooms(rooms []*Room, username string) []*Room {
	for _, room := range rooms {
		room = GetMaskedRoom(room, username)
	}
	return rooms
}

func GetPublicRooms(rooms []*Room) []*Room {
	res := []*Room{}
	for _, room := range rooms {
		if room.IsPublic {
			res = append(res, room)
		}
	}
	return res
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

		room.updateRoomStartUrl()
	}

	return room
}

func UpdateRoom(id string, room *Room) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getRoom(owner, name) == nil {
		return false
	}

	if room.MeetingNumber != "" {
		room.updateRoomRegistrants()
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(room)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func IncrementRoomViewer(id string) bool {
	room := Room{}
	owner, name := util.GetOwnerAndNameFromId(id)

	_, err := adapter.engine.ID(core.PK{owner, name}).Incr("viewer_count").Update(room)
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

func RegisterRoom(id string, username string) *Room {
	room := GetRoom(id)
	if room == nil {
		return nil
	}

	for _, participant := range room.Participants {
		if participant.Name == username {
			if participant.JoinUrl == "" {
				joinUrl := addMeetingRegistrant(room.MeetingNumber, participant.Name, participant.DisplayName, participant.Email, participant.Affiliation)
				participant.JoinUrl = joinUrl

				UpdateRoom(room.GetId(), room)
				return room
			}
		}
	}

	user := casdoor.GetUser(username)
	participant := &Participant{
		Name:        username,
		CreatedTime: util.GetCurrentTime(),
		DisplayName: user.DisplayName,
		Email:       user.Email,
		Affiliation: user.Affiliation,
		Tag:         user.Tag,
		Role:        "Participant",
		JoinUrl:     "",
	}

	joinUrl := addMeetingRegistrant(room.MeetingNumber, participant.Name, participant.DisplayName, participant.Email, participant.Affiliation)
	participant.JoinUrl = joinUrl
	room.Participants = append(room.Participants, participant)

	UpdateRoom(room.GetId(), room)
	return room
}

func (room *Room) updateRoomStartUrl() {
	if room.MeetingNumber == "" || room.MeetingNumber == "123456789" {
		return
	}

	if room.StartUrl == "" {
		startUrl := getMeetingStartUrl(room.MeetingNumber)
		room.StartUrl = startUrl
		UpdateRoom(room.GetId(), room)
		return
	}

	tokens := strings.SplitN(room.StartUrl, "?zak=", 2)
	if len(tokens) < 2 {
		startUrl := getMeetingStartUrl(room.MeetingNumber)
		room.StartUrl = startUrl
		UpdateRoom(room.GetId(), room)
		return
	}

	zakToken := tokens[1]
	zakTokenExpireTime := getZakExpireTime(zakToken)
	if zakTokenExpireTime.Before(time.Now()) {
		startUrl := getMeetingStartUrl(room.MeetingNumber)
		room.StartUrl = startUrl
		UpdateRoom(room.GetId(), room)
	}
}
