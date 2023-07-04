package sdk

type Files interface {
	Add(path string) (cid string, err error)
	FindFile(cid string) (filepath string, err error)
}
