package files

// 默克树在datastore中的key名称
func hashKey(root string) string {
	return "hash/" + root
}
