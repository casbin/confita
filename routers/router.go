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

	beego.Router("/api/get-posts", &controllers.ApiController{}, "POST:GetPosts")
}
