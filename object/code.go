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
	"github.com/casbin/confita/util"
	"xorm.io/core"
)

type Code struct {
	Owner       string   `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string   `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string   `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string   `xorm:"varchar(100)" json:"displayName"`
	Notebook    string   `xorm:"varchar(100)" json:"notebook"`
	Tags        []string `xorm:"varchar(100)" json:"tags"`
	ImgUrl      string   `xorm:"varchar(100)" json:"imgUrl"`
}

func GetGlobalCodes() []*Code {
	codes := []*Code{}
	err := adapter.engine.Asc("owner").Desc("created_time").Find(&codes)
	if err != nil {
		panic(err)
	}

	return codes
}

func GetCodes(owner string) []*Code {
	codes := []*Code{}
	err := adapter.engine.Desc("created_time").Find(&codes, &Code{Owner: owner})
	if err != nil {
		panic(err)
	}

	return codes
}

func getCode(owner string, name string) *Code {
	code := Code{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&code)
	if err != nil {
		panic(err)
	}

	if existed {
		return &code
	} else {
		return nil
	}
}

func GetCode(id string) *Code {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getCode(owner, name)
}

func UpdateCode(id string, code *Code) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getCode(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(code)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddCode(code *Code) bool {
	affected, err := adapter.engine.Insert(code)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteCode(code *Code) bool {
	affected, err := adapter.engine.ID(core.PK{code.Owner, code.Name}).Delete(&Code{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}
