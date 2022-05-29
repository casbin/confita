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

	"github.com/casbin/confita/util"
	"github.com/cristalhq/jwt/v4"
)

type JwtPayload struct {
	SdkKey   string `json:"sdkKey"`
	Mn       string `json:"mn"`
	Role     string `json:"role"`
	Iat      int64  `json:"iat"`
	Exp      int64  `json:"exp"`
	AppKey   string `json:"appKey"`
	TokenExp int64  `json:"tokenExp"`
}

func generateJwtPayload(meetingNumber string, role string) string {
	iat := time.Now().Unix() - 30
	exp := iat + 60*60*2

	payload := JwtPayload{
		SdkKey:   zoomSdkKey,
		Mn:       meetingNumber,
		Role:     role,
		Iat:      iat,
		Exp:      exp,
		AppKey:   zoomSdkKey,
		TokenExp: exp,
	}

	res := util.StructToJsonCompact(payload)
	return res
}

func generateSignature(meetingNumber string, role string) string {
	examplePayload := generateJwtPayload(meetingNumber, role)
	signer, err := jwt.NewSignerHS(jwt.HS256, []byte(zoomSdkSecret))
	if err != nil {
		panic(err)
	}

	token, err := jwt.NewBuilder(signer).Build(examplePayload)
	if err != nil {
		panic(err)
	}

	return token.String()
}
