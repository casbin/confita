package object

import (
	"github.com/confita/confita/util"
	"xorm.io/core"
)

type TreeItem struct {
	Key       string      `xorm:"varchar(100)" json:"key"`
	Title     string      `xorm:"varchar(100)" json:"title"`
	Content   string      `xorm:"mediumtext" json:"content"`
	TitleEn   string      `xorm:"varchar(100)" json:"titleEn"`
	ContentEn string      `xorm:"mediumtext" json:"contentEn"`
	Children  []*TreeItem `xorm:"varchar(1000)" json:"children"`
}

type Conference struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	StartDate string `xorm:"varchar(100)" json:"startDate"`
	EndDate   string `xorm:"varchar(100)" json:"endDate"`
	FullName  string `xorm:"varchar(100)" json:"fullName"`
	Organizer string `xorm:"varchar(100)" json:"organizer"`
	Location  string `xorm:"varchar(100)" json:"location"`
	Address   string `xorm:"varchar(100)" json:"address"`
	Status    string `xorm:"varchar(100)" json:"status"`
	Language  string `xorm:"varchar(100)" json:"language"`

	Carousels []string    `xorm:"mediumtext" json:"carousels"`
	IntroText string      `xorm:"mediumtext" json:"introText"`
	TreeItems []*TreeItem `xorm:"mediumtext" json:"treeItems"`
}

func GetGlobalConferences() []*Conference {
	conferences := []*Conference{}
	err := adapter.engine.Asc("owner").Desc("created_time").Find(&conferences)
	if err != nil {
		panic(err)
	}

	return conferences
}

func GetConferences(owner string) []*Conference {
	conferences := []*Conference{}
	err := adapter.engine.Desc("created_time").Find(&conferences, &Conference{Owner: owner})
	if err != nil {
		panic(err)
	}

	return conferences
}

func getConference(owner string, name string) *Conference {
	conference := Conference{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&conference)
	if err != nil {
		panic(err)
	}

	if existed {
		return &conference
	} else {
		return nil
	}
}

func GetConference(id string) *Conference {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getConference(owner, name)
}

func UpdateConference(id string, conference *Conference) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getConference(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(conference)
	if err != nil {
		panic(err)
	}

	//return affected != 0
	return true
}

func AddConference(conference *Conference) bool {
	affected, err := adapter.engine.Insert(conference)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteConference(conference *Conference) bool {
	affected, err := adapter.engine.ID(core.PK{conference.Owner, conference.Name}).Delete(&Conference{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}
