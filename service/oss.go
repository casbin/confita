package service

import "github.com/casdoor/casdoor-go-sdk/auth"

func UploadFileToStorage(user string, tag string, parent string, fullFilePath string, fileBytes []byte) (string, string) {
	fileUrl, objectKey, err := auth.UploadResource(user, tag, parent, fullFilePath, fileBytes)
	if err != nil {
		panic(err)
	}

	return fileUrl, objectKey
}

func DeleteFileFromStorage(objectKey string) bool {
	affected, err := auth.DeleteResource(objectKey)
	if err != nil {
		panic(err)
	}

	return affected
}
