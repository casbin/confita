package oss

import (
	"bytes"
	"fmt"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
)

func getBucket() *oss.Bucket {
	client, err := oss.New(endpoint, accessKeyId, accessKeySecret)
	if err != nil {
		panic(err)
	}

	bucket, err := client.Bucket(bucketName)
	if err != nil {
		panic(err)
	}

	return bucket
}

func UploadFileAndGetLink(folder string, owner string, filename string, fileBytes []byte) (string, string) {
	reader := bytes.NewReader(fileBytes)

	bucket := getBucket()

	objectKey := fmt.Sprintf("%s/%s/%s", folder, owner, filename)
	err := bucket.PutObject(objectKey, reader)
	if err != nil {
		panic(err)
	}

	url := fmt.Sprintf("https://%s/%s/%s/%s", domain, folder, owner, filename)
	return url, objectKey
}

func GetFile(folder string, owner string, filename string) (string, string) {
	bucket := getBucket()

	objectKey := fmt.Sprintf("%s/%s/%s", folder, owner, filename)
	existed, err := bucket.IsObjectExist(objectKey)
	if err != nil {
		panic(err)
	}

	if existed {
		url := fmt.Sprintf("https://%s/%s/%s/%s", domain, folder, owner, filename)
		return url, objectKey
	} else {
		return "", objectKey
	}
}

func DeleteFile(objectKey string) {
	bucket := getBucket()

	err := bucket.DeleteObject(objectKey)
	if err != nil {
		panic(err)
	}
}
