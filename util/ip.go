package util

import "github.com/pkg/errors"

func InitIpDb() {
	err := Init("data/17monipdb.dat")
	if err != nil {
		panic(err)
	}
}

func IsMainland(ip string) bool {
	info, err := Find(ip)
	if err != nil {
		panic(errors.Wrap(err, "ip = " + ip))
	}

	return info.Country == "中国"
}

func GetDescFromIP(ip string) string {
	info, err := Find(ip)
	if err != nil {
		return ""
	}

	res := info.Country + ", " + info.Region + ", " + info.City
	if info.Isp != Null {
		res += ", " + info.Isp
	}

	return res
}
