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

package routers

import (
	"github.com/astaxie/beego"

	"github.com/casbin/confita/controllers"
)

func init() {
	initAPI()
}

func initAPI() {
	ns :=
		beego.NewNamespace("/api",
			beego.NSInclude(
				&controllers.ApiController{},
			),
		)
	beego.AddNamespace(ns)

	beego.Router("/api/signin", &controllers.ApiController{}, "POST:Signin")
	beego.Router("/api/signout", &controllers.ApiController{}, "POST:Signout")
	beego.Router("/api/get-account", &controllers.ApiController{}, "GET:GetAccount")

	beego.Router("/api/get-global-conferences", &controllers.ApiController{}, "GET:GetGlobalConferences")
	beego.Router("/api/get-conferences", &controllers.ApiController{}, "GET:GetConferences")
	beego.Router("/api/get-conference", &controllers.ApiController{}, "GET:GetConference")
	beego.Router("/api/update-conference", &controllers.ApiController{}, "POST:UpdateConference")
	beego.Router("/api/add-conference", &controllers.ApiController{}, "POST:AddConference")
	beego.Router("/api/delete-conference", &controllers.ApiController{}, "POST:DeleteConference")

	beego.Router("/api/get-global-codes", &controllers.ApiController{}, "GET:GetGlobalCodes")
	beego.Router("/api/get-codes", &controllers.ApiController{}, "GET:GetCodes")
	beego.Router("/api/get-code", &controllers.ApiController{}, "GET:GetCode")
	beego.Router("/api/update-code", &controllers.ApiController{}, "POST:UpdateCode")
	beego.Router("/api/add-code", &controllers.ApiController{}, "POST:AddCode")
	beego.Router("/api/delete-code", &controllers.ApiController{}, "POST:DeleteCode")

	beego.Router("/api/get-global-submissions", &controllers.ApiController{}, "GET:GetGlobalSubmissions")
	beego.Router("/api/get-submissions", &controllers.ApiController{}, "GET:GetSubmissions")
	beego.Router("/api/get-submission", &controllers.ApiController{}, "GET:GetSubmission")
	beego.Router("/api/update-submission", &controllers.ApiController{}, "POST:UpdateSubmission")
	beego.Router("/api/add-submission", &controllers.ApiController{}, "POST:AddSubmission")
	beego.Router("/api/delete-submission", &controllers.ApiController{}, "POST:DeleteSubmission")
	beego.Router("/api/upload-submission-file", &controllers.ApiController{}, "POST:UploadSubmissionFile")

	beego.Router("/api/get-global-rooms", &controllers.ApiController{}, "GET:GetGlobalRooms")
	beego.Router("/api/get-rooms", &controllers.ApiController{}, "GET:GetRooms")
	beego.Router("/api/get-room", &controllers.ApiController{}, "GET:GetRoom")
	beego.Router("/api/update-room", &controllers.ApiController{}, "POST:UpdateRoom")
	beego.Router("/api/increment-room-viewer", &controllers.ApiController{}, "POST:IncrementRoomViewer")
	beego.Router("/api/add-room", &controllers.ApiController{}, "POST:AddRoom")
	beego.Router("/api/delete-room", &controllers.ApiController{}, "POST:DeleteRoom")
	beego.Router("/api/register-room", &controllers.ApiController{}, "GET:RegisterRoom")

	beego.Router("/api/get-products", &controllers.ApiController{}, "GET:GetProducts")
	beego.Router("/api/get-global-payments", &controllers.ApiController{}, "GET:GetGlobalPayments")
	beego.Router("/api/get-payments", &controllers.ApiController{}, "GET:GetPayments")

	beego.Router("/api/get-users", &controllers.ApiController{}, "GET:GetUsers")
}
