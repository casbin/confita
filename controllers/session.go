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
	"fmt"

	"github.com/casdoor/casdoor-go-sdk/auth"
)

var sessionMap = map[string]int64{}

func clearUserDuplicated(claims *auth.Claims) {
	userId := fmt.Sprintf("%s/%s", claims.Owner, claims.Name)
	delete(sessionMap, userId)
}

func isUserDuplicated(claims *auth.Claims) bool {
	userId := fmt.Sprintf("%s/%s", claims.Owner, claims.Name)
	unixTimestamp := claims.IssuedAt.Unix()

	sessionUnixTimestamp, ok := sessionMap[userId]
	if !ok {
		sessionMap[userId] = unixTimestamp
		return false
	} else {
		if unixTimestamp == sessionUnixTimestamp {
			return false
		} else {
			return true
		}
	}
}
