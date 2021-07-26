package routers

import (
	"github.com/astaxie/beego"

	"github.com/confita/confita/controllers"
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
	beego.Router("/api/get-users", &controllers.ApiController{}, "GET:GetUsers")

	beego.Router("/api/get-conferences", &controllers.ApiController{}, "GET:GetConferences")
	beego.Router("/api/get-conference", &controllers.ApiController{}, "GET:GetConference")
	beego.Router("/api/update-conference", &controllers.ApiController{}, "POST:UpdateConference")
	beego.Router("/api/add-conference", &controllers.ApiController{}, "POST:AddConference")
	beego.Router("/api/delete-conference", &controllers.ApiController{}, "POST:DeleteConference")

	beego.Router("/api/get-resources", &controllers.ApiController{}, "GET:GetResources")
	beego.Router("/api/get-resource", &controllers.ApiController{}, "GET:GetResource")
	beego.Router("/api/update-resource", &controllers.ApiController{}, "POST:UpdateResource")
	beego.Router("/api/add-resource", &controllers.ApiController{}, "POST:AddResource")
	beego.Router("/api/delete-resource", &controllers.ApiController{}, "POST:DeleteResource")
	beego.Router("/api/upload-resource", &controllers.ApiController{}, "POST:UploadResource")
}
