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
	"time"

	"github.com/livekit/protocol/auth"
	lksdk "github.com/livekit/server-sdk-go"
)

var lkClient *lksdk.RoomServiceClient

func init() {
	lkClient = InitLkClient()
}

func InitLkClient() *lksdk.RoomServiceClient {
	client := lksdk.NewRoomServiceClient(lkHost, lkKey, lkSecret)
	return client
}

//func getLkRoom() {
//	lkClient.CreateRoom()
//}
//
//func createRoom(room string) {
//	host := "host"
//	apiKey := "key"
//	apiSecret := "secret"
//
//	roomName := "myroom"
//	identity := "participantIdentity"
//
//	roomClient := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)
//
//	// create a new room
//	room, _ := roomClient.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
//		Name: roomName,
//	})
//}

func getLkRoomToken(roomName string, username string) (string, error) {
	at := auth.NewAccessToken(lkKey, lkSecret)
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     roomName,
	}
	at.AddGrant(grant).SetIdentity(username).SetValidFor(time.Hour * 24 * 365 * 100)

	return at.ToJWT()
}

func aaa() {

}
