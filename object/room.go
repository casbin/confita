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

	"github.com/casbin/confita/util"
	"github.com/casdoor/casdoor-go-sdk/auth"
	"xorm.io/core"
)

type Participant struct {
	Name        string `xorm:"varchar(100)" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`
	Affiliation string `xorm:"varchar(100)" json:"affiliation"`
	Tag         string `xorm:"varchar(100)" json:"tag"`
	Status      string `xorm:"varchar(100)" json:"status"`
	Token       string `xorm:"varchar(100)" json:"token"`
}

type Room struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`

	Conference   string `xorm:"varchar(100)" json:"conference"`
	ServerUrl    string `xorm:"varchar(100)" json:"serverUrl"`
	EmptyTimeout string `xorm:"varchar(100)" json:"emptyTimeout"`
	MaxCount     string `xorm:"varchar(100)" json:"maxCount"`
	TurnPassword string `xorm:"varchar(100)" json:"turnPassword"`
	Status       string `xorm:"varchar(100)" json:"status"`

	Participants []*Participant `xorm:"mediumtext" json:"participants"`
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

	if room != nil {
		room.updateRoomParticipants()
	}

	return room
}

func UpdateRoom(id string, room *Room) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getRoom(owner, name) == nil {
		return false
	}

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

func getParticipantId(user *auth.User) string {
	return fmt.Sprintf("%s (%s)", user.DisplayName, user.Name)
}

func JoinRoom(id string, user *auth.User) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	room := getRoom(owner, name)
	if room == nil {
		return false
	}

	participantMap := room.getRoomParticipantMap()
	if participant, ok := participantMap[getParticipantId(user)]; ok {
		removeLkRoomParticipant(room.Name, getParticipantId(user))

		token, err := getLkRoomToken(room.Name, getParticipantId(user))
		if err != nil {
			panic(err)
		}
		participant.Token = token
	} else {
		newParticipant := &Participant{
			Name:        user.Name,
			CreatedTime: util.GetCurrentTime(),
			DisplayName: user.DisplayName,
			Affiliation: user.Affiliation,
			Tag:         user.Tag,
			Status:      "Joined",
		}
		token, err := getLkRoomToken(room.Name, getParticipantId(user))
		if err != nil {
			panic(err)
		}
		newParticipant.Token = token

		room.Participants = append(room.Participants, newParticipant)
	}

	return UpdateRoom(id, room)
}

func LeaveRoom(id string, user *auth.User) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	room := getRoom(owner, name)
	if room == nil {
		return false
	}

	removeLkRoomParticipant(room.Name, getParticipantId(user))

	participants := []*Participant{}
	for _, participant := range room.Participants {
		if participant.Name != user.Name {
			participants = append(participants, participant)
		}
	}
	room.Participants = participants

	return UpdateRoom(id, room)
}

func (room *Room) getRoomParticipantMap() map[string]*Participant {
	participantMap := map[string]*Participant{}
	for _, participant := range room.Participants {
		participantId := fmt.Sprintf("%s (%s)", participant.DisplayName, participant.Name)
		participantMap[participantId] = participant
	}
	return participantMap
}

func (room *Room) updateRoomParticipants() {
	participantMap := room.getRoomParticipantMap()

	participantInfos := getLkRoomParticipants(room.Name)
	if participantInfos == nil {
		return
	}

	for _, participantInfo := range participantInfos {
		participant, ok := participantMap[participantInfo.Identity]
		if ok {
			participant.Status = strings.Title(strings.ToLower(participantInfo.State.String()))
		} else {
			removeLkRoomParticipant(room.Name, participantInfo.Identity)
		}
	}

	UpdateRoom(room.GetId(), room)
}
