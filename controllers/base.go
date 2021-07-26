package controllers

import (
	"github.com/astaxie/beego"
	"github.com/casdoor/casdoor-go-sdk/auth"
	"github.com/confita/confita/util"
)

type ApiController struct {
	beego.Controller
}

func (c *ApiController) GetSessionUser() *auth.Claims {
	s := c.GetSession("user")
	if s == nil {
		return nil
	}

	claims := &auth.Claims{}
	err := util.JsonToStruct(s.(string), claims)
	if err != nil {
		panic(err)
	}

	return claims
}

func (c *ApiController) SetSessionUser(claims *auth.Claims) {
	if claims == nil {
		c.DelSession("user")
		return
	}

	s := util.StructToJson(claims)
	c.SetSession("user", s)
}

func (c *ApiController) GetSessionUsername() string {
	claims := c.GetSessionUser()
	if claims == nil {
		return ""
	}
	return claims.Username
}

func (c *ApiController) SetSessionUsername(username string) {
	claims := &auth.Claims{}
	claims.Username = username
	c.SetSessionUser(claims)
}

func wrapActionResponse(affected bool) *Response {
	if affected {
		return &Response{Status: "ok", Msg: "", Data: "Affected"}
	} else {
		return &Response{Status: "ok", Msg: "", Data: "Unaffected"}
	}
}
