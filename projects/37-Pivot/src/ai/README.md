# AI 验证和压缩率计算
## 1.安装依赖
```shell script
pip install pandas
pip install typer
pip install loguru
```
### 2. check 固定随机种子确定两次模型是否一致
```shell script
${PYTHON_HOME}/bin/python pivot_ai.py  check-is-equal --first_file ${first_file} --second_file ${second_file}
```

### 2. 计算压缩率
```shell script
${PYTHON_HOME}/bin/python pivot_ai.py  comression-rate --file ${file}
```