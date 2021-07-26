package oss

import "testing"

func TestDeploy(t *testing.T) {
	uploadFolder("js")
	uploadFolder("css")

	updateHtml()
}
