package controllers

import (
	"github.com/astaxie/beego"
	"github.com/casdoor/casdoor-go-sdk/auth"
)

type Response struct {
	Status string      `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
	Data2  interface{} `json:"data2"`
}

var CasdoorEndpoint = beego.AppConfig.String("casdoorEndpoint")
var ClientId = beego.AppConfig.String("clientId")
var ClientSecret = beego.AppConfig.String("clientSecret")
var JwtSecret = beego.AppConfig.String("jwtSecret")
var CasdoorOrganization = beego.AppConfig.String("casdoorOrganization")

func init() {
	auth.InitConfig(CasdoorEndpoint, ClientId, ClientSecret, JwtSecret, CasdoorOrganization)
}

func (c *ApiController) Signin() {
	code := c.Input().Get("code")
	state := c.Input().Get("state")

	token, err := auth.GetOAuthToken(code, state)
	if err != nil {
		panic(err)
	}

	claims, err := auth.ParseJwtToken(token.AccessToken)
	if err != nil {
		panic(err)
	}

	claims.AccessToken = token.AccessToken
	c.SetSessionUser(claims)

	resp := &Response{Status: "ok", Msg: "", Data: claims}
	c.Data["json"] = resp
	c.ServeJSON()
}

func (c *ApiController) Signout() {
	var resp Response

	c.SetSessionUser(nil)

	resp = Response{Status: "ok", Msg: ""}
	c.Data["json"] = resp
	c.ServeJSON()
}

func (c *ApiController) GetAccount() {
	var resp Response

	if c.GetSessionUser() == nil {
		resp = Response{Status: "error", Msg: "please sign in first", Data: c.GetSessionUser()}
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	claims := c.GetSessionUser()
	userObj := claims
	resp = Response{Status: "ok", Msg: "", Data: userObj}

	c.Data["json"] = resp
	c.ServeJSON()
}

func (c *ApiController) GetUsers() {
	var resp Response

	//owner := c.Input().Get("owner")

	users, err := auth.GetUsers()
	if err != nil {
		resp = Response{Status: "error", Msg: err.Error()}
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	c.Data["json"] = users
	c.ServeJSON()
}
