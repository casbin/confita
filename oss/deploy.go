package oss

import (
	"fmt"
	"os"
	"strings"

	"github.com/casbin/confita/util"
)

func uploadFolder(folder string) {
	path := fmt.Sprintf("../web/build/static/%s/", folder)
	filenames := util.ListFiles(path)

	bucket := getBucket()

	for _, filename := range filenames {
		file, err := os.Open(path + filename)
		if err != nil {
			panic(err)
		}

		objectKey := fmt.Sprintf("confita/static/%s/%s", folder, filename)
		err = bucket.PutObject(objectKey, file)
		if err != nil {
			panic(err)
		}

		fmt.Printf("Uploaded [%s] to [%s]\n", path, objectKey)
	}
}

func updateHtml() {
	htmlPath := "../web/build/index.html"
	html := util.ReadStringFromPath(htmlPath)
	html = strings.Replace(html, "\"/static/", fmt.Sprintf("\"https://%s/confita/static/", domain), -1)
	util.WriteStringToPath(html, htmlPath)

	fmt.Printf("Updated HTML to [%s]\n", html)
}
