package object

import (
	"github.com/confita/confita/oss"
	"github.com/confita/confita/util"
	"xorm.io/core"
)

type Resource struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	Type       string `xorm:"varchar(100)" json:"type"`
	FileFormat string `xorm:"varchar(100)" json:"fileFormat"`
	FileSize   int    `json:"fileSize"`
	Conference string `xorm:"varchar(100)" json:"conference"`
	Url        string `xorm:"varchar(2000)" json:"url"`
	ObjectKey  string `xorm:"varchar(2000)" json:"objectKey"`
}

func GetResources(owner string) []*Resource {
	resources := []*Resource{}
	err := adapter.engine.Desc("created_time").Find(&resources, &Resource{Owner: owner})
	if err != nil {
		panic(err)
	}

	return resources
}

func getResource(owner string, name string) *Resource {
	resource := Resource{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&resource)
	if err != nil {
		panic(err)
	}

	if existed {
		return &resource
	} else {
		return nil
	}
}

func GetResource(id string) *Resource {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getResource(owner, name)
}

func UpdateResource(id string, resource *Resource) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getResource(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(resource)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddResource(resource *Resource) bool {
	affected, err := adapter.engine.Insert(resource)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteResource(resource *Resource) bool {
	oss.DeleteFile(resource.ObjectKey)

	affected, err := adapter.engine.ID(core.PK{resource.Owner, resource.Name}).Delete(&Resource{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}
