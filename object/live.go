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
	"strings"

	"github.com/aliyun/alibaba-cloud-sdk-go/sdk"
	"github.com/aliyun/alibaba-cloud-sdk-go/sdk/auth/credentials"
	"github.com/aliyun/alibaba-cloud-sdk-go/services/live"
)

var LiveClient *live.Client

func init() {
	LiveClient = getLiveClient()
}

func getLiveClient() *live.Client {
	config := sdk.NewConfig()
	credential := credentials.NewAccessKeyCredential(clientId, clientSecret)
	client, err := live.NewClientWithOptions("cn-beijing", config, credential)
	if err != nil {
		panic(err)
	}

	return client
}

func getLiveDomainOnlineCount(room *Room) map[string]int {
	request := live.CreateDescribeLiveDomainOnlineUserNumRequest()
	request.Scheme = "https"

	request.DomainName = room.StreamingDomain

	response, err := LiveClient.DescribeLiveDomainOnlineUserNum(request)
	if err != nil {
		panic(err)
	}

	res := map[string]int{}
	for _, streamInfo := range response.OnlineUserInfo.LiveStreamOnlineUserNumInfo {
		tokens := strings.Split(streamInfo.StreamName, "/")
		streamName := tokens[len(tokens)-1]

		res[streamName] = 0
		for _, subStreamInfo := range streamInfo.Infos.Info {
			res[streamName] += int(subStreamInfo.UserNumber)
		}
	}
	return res
}

func getLiveStreamOnlineMap(room *Room) map[string]int {
	request := live.CreateDescribeLiveStreamsOnlineListRequest()
	request.Scheme = "https"

	request.DomainName = room.IngestDomain
	request.AppName = room.Conference
	request.StreamName = room.Name

	response, err := LiveClient.DescribeLiveStreamsOnlineList(request)
	if err != nil {
		panic(err)
	}

	res := map[string]int{}
	for _, info := range response.OnlineInfo.LiveStreamOnlineInfo {
		res[info.StreamName] = 1
	}
	return res
}

func GetRoomWithLive(room *Room) *Room {
	if room.IngestDomain == "" {
		return room
	}

	domainOnlineCountMap := getLiveDomainOnlineCount(room)
	streamOnlineMap := getLiveStreamOnlineMap(room)

	_, isLive := streamOnlineMap[room.Name]
	room.IsLive = isLive
	if isLive {
		room.LiveUserCount = domainOnlineCountMap[room.Name]
	}

	return room
}

func GetRoomsWithLive(rooms []*Room) []*Room {
	if len(rooms) == 0 {
		return rooms
	}

	domainOnlineCountMap := getLiveDomainOnlineCount(rooms[0])
	for _, room := range rooms {
		if room.IngestDomain == "" {
			continue
		}

		streamOnlineMap := getLiveStreamOnlineMap(room)
		_, isLive := streamOnlineMap[room.Name]
		room.IsLive = isLive
		if isLive {
			room.LiveUserCount = domainOnlineCountMap[room.Name]
		}
	}

	return rooms
}
