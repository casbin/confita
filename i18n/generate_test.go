package i18n

import (
	"testing"

	"github.com/confita/confita/util"
)

func TestGenerateI18nStrings(t *testing.T) {
	data := parseToData()
	s := util.StructToJson(data)
	println(s)
}
