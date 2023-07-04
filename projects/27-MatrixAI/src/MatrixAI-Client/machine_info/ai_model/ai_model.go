package ai_model

type InfoAIModel struct {
	ModelName string `json:"ModelName"` // 模型名称
	Version   string `json:"Version"`   // 模型版本
}

func GetAIModelInfo() ([]InfoAIModel, error) {
	aiModelInfos := make([]InfoAIModel, 0)

	// 返回模型信息
	aiModelInfos = append(aiModelInfos, InfoAIModel{
		ModelName: "paddlepaddle",
		Version:   "v2.4.2",
	})
	return aiModelInfos, nil
}
