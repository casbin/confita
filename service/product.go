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

package service

import (
	"encoding/json"

	"github.com/casdoor/casdoor-go-sdk/auth"
)

type Product struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`

	Image     string   `xorm:"varchar(100)" json:"image"`
	Detail    string   `xorm:"varchar(100)" json:"detail"`
	Tag       string   `xorm:"varchar(100)" json:"tag"`
	Currency  string   `xorm:"varchar(100)" json:"currency"`
	Price     float64  `json:"price"`
	Quantity  int      `json:"quantity"`
	Sold      int      `json:"sold"`
	Providers []string `xorm:"varchar(100)" json:"providers"`
	ReturnUrl string   `xorm:"varchar(1000)" json:"returnUrl"`

	State string `xorm:"varchar(100)" json:"state"`
}

func GetProducts() ([]*Product, error) {
	owner := "admin"

	queryMap := map[string]string{
		"owner": owner,
	}

	url := auth.GetUrl("get-products", queryMap)

	bytes, err := auth.DoGetBytesRaw(url)
	if err != nil {
		return nil, err
	}

	var products []*Product
	err = json.Unmarshal(bytes, &products)
	if err != nil {
		return nil, err
	}
	return products, nil
}
