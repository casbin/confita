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
	"github.com/BPing/aliyun-live-go-sdk/aliyun"
	"github.com/BPing/aliyun-live-go-sdk/device/live"
)

func getLiveClient(ingestDomain string, appName string) *live.Live {
	cred := aliyun.NewCredentials(clientId, clientSecret)
	res := live.NewLive(cred, ingestDomain, appName, nil).SetDebug(false)
	return res
}

func getStreamOnlineCount(room *Room) int {
	client := getLiveClient(room.IngestDomain, room.Conference)

	resp := make(map[string]interface{})
	err := client.StreamOnlineUserNum(room.Name, &resp)
	if err != nil {
		panic(err)
	}

	totalUserNumber := resp["TotalUserNumber"].(float64)
	return int(totalUserNumber)
}

func getLiveStreamMap(room *Room) map[string]int {
	client := getLiveClient(room.IngestDomain, room.Conference)

	resp := make(map[string]interface{})
	err := client.StreamsOnlineList(&resp)
	if err != nil {
		panic(err)
	}

	var onlineInfo map[string]interface{}
	onlineInfo = resp["OnlineInfo"].(map[string]interface{})

	var liveStreamOnlineInfo []interface{}
	liveStreamOnlineInfo = onlineInfo["LiveStreamOnlineInfo"].([]interface{})

	res := map[string]int{}
	for _, tmpInfo := range liveStreamOnlineInfo {
		info := tmpInfo.(map[string]interface{})
		streamName := info["StreamName"].(string)
		res[streamName] = 1
	}
	return res
}

func GetRoomWithLive(room *Room) *Room {
	streamMap := getLiveStreamMap(room)

	_, isLive := streamMap[room.Name]
	room.IsLive = isLive

	room.LiveUserCount = getStreamOnlineCount(room)

	return room
}

func GetRoomsWithLive(rooms []*Room) []*Room {
	if len(rooms) == 0 {
		return rooms
	}

	streamMap := getLiveStreamMap(rooms[0])
	for _, room := range rooms {
		_, isLive := streamMap[room.Name]
		room.IsLive = isLive

		room.LiveUserCount = getStreamOnlineCount(room)
	}

	return rooms
}
