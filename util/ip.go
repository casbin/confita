// Copyright 2021 The casbin Authors. All Rights Reserved.
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

package util

import "github.com/pkg/errors"

func InitIpDb() {
	err := Init("data/17monipdb.dat")
	if err != nil {
		panic(err)
	}
}

func IsMainland(ip string) bool {
	info, err := Find(ip)
	if err != nil {
		panic(errors.Wrap(err, "ip = " + ip))
	}

	return info.Country == "中国"
}

func GetDescFromIP(ip string) string {
	info, err := Find(ip)
	if err != nil {
		return ""
	}

	res := info.Country + ", " + info.Region + ", " + info.City
	if info.Isp != Null {
		res += ", " + info.Isp
	}

	return res
}
