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
