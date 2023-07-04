# 第一步：执行模型考试任务，生成对应的CSV文件。
# 第二步：验证节点，重新执行一遍考试任务，保持seed随机数不变，验证结果是否一致
# 第三步：验证结果通过，计算压缩率。
```shell script
!pip install openai
!pip install langchain
from langchain.llms import OpenAI
openai_api_key="YOUR_OPENAI_API_KEY" 
import locale
def getpreferredencoding(do_setlocale = True):
    return "UTF-8"
locale.getpreferredencoding = getpreferredencoding
!git clone https://github.com/imClumsyPanda/langchain-ChatGLM.git /content/drive/MyDrive/工作效率神器OpenAI/ChatGLM_personalKhowledge/langchain_ChatGLM/ #save the langchain-ChatGLM repository to your Google Drive
```

## Install the necessary dependencies
```shell script
%cd /content/drive/MyDrive/工作效率神器OpenAI/ChatGLM_personalKhowledge/langchain_ChatGLM
!pip install -r requirements.txt
!pip install --upgrade protobuf
!sudo apt install iputils-ping
```

## Initiate chatGLM model
```shell script
from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("THUDM/chatglm-6b-int4-qe", trust_remote_code=True)
model = AutoModel.from_pretrained("THUDM/chatglm-6b-int4-qe", trust_remote_code=True).half().cuda()
model = model.eval()
response, history = model.chat(tokenizer, "你好", history=[])
print(response)


from transformers import set_seed # Set the random seed to 42
set_seed(42)
```

## Upload test data
```shell script
import pandas as pd
file_path = "/content/drive/MyDrive/工作效率神器OpenAI/ChatGLM_personalKhowledge/SAT_testv2.csv" 

try:
    df = pd.read_csv(file_path)
except UnicodeDecodeError:
    try:
        df = pd.read_csv(file_path, encoding='latin1') # or 'iso-8859-1' or 'cp1252'
    except Exception as e:
        print("Error: ", e)
df.head()
```

## Start the inference and save the response in the dataframe
```shell script
GLM_responses = []
for idx, row in df.iterrows():
    # If the background is not empty
    if pd.notna(row['Background']):
        description = row['Background'] + " " + row['Question'] + " " + row['Choices']
    else:  # if the background is empty
        description = row['Question'] + " " + row['Choices']

    description_quoted = f'"""{description}"""'
    GLM_response = model.chat(tokenizer, description_quoted)  # assuming model.chat() is defined
    answer = GLM_response[1][0][1] # Extract the answer
    GLM_responses.append(answer)
    # Print the current iteration number and its response
    print(f"Iteration {idx + 1} response: {answer}")

df['GLM_Response'] = GLM_responses  # add responses to dataframe as a new column

df_GLM_verified = df.copy()
df_GLM_verified.head(33)

```

## Formate the response in the dataframe using openAI
```shell script
import openai
import pandas as pd

openai.api_key = openai_api_key

def format_response(row):
    falcon_response = row["GLM_Response"].strip()
    choices = row["Choices"]

    if falcon_response in ["A", "B", "C", "D", "'A'", "'B'", "'C'", "'D'"]:
      formatted_response = falcon_response.strip("'")
    elif falcon_response.startswith(("True.", "True")):
      formatted_response = "True"
    elif falcon_response.startswith(("False.", "False")):
      formatted_response = "False"
    elif falcon_response.startswith("Else."):
      formatted_response = "Else"
    else:
        prompt = "Please extract the answer from the below paragraph, the answer could be among the choices or True, or False, please return A,B,C,D or True of False, if none of the options are met, please return 'The model failed to generate an answer'"
        text = f"""these are the choices: {choices}
        and this is the answer or explanation:
        {falcon_response}"""

        # Generate the summary using OpenAI's GPT-3.5-turbo model
        response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"{prompt}\n\n{text}",
        max_tokens=200,
        temperature=0.2,
        n=1,
        stop=None,
        )

        # Extract the generated summary from the response
        formatted_response = response.choices[0].text.strip()

    # remove trailing periods
    if formatted_response.endswith('.'):
        formatted_response = formatted_response[:-1]

    # Print the result for each iteration
    print(f"Iteration {row.name}: {formatted_response}")

    return formatted_response

#Apply the formatting function to the Falcon_response column
df_GLM_verified["Formatted_response_y"] = df_GLM_verified.apply(format_response, axis=1)

#Print each iteration
for index, row in df_GLM_verified.iterrows():
    print(f"Iteration {index}: {row['Formatted_response_y']}")

```

```shell script
##Add three columns to the dataframe
df_GLM_verified["model_id"] = 1
df_GLM_verified["model_parameters"] = 6500000000
df_GLM_verified["training_set"] = 1099511627776
df_GLM_verified.head(15)

##Save the dataframe
from google.colab import files
df_GLM_verified.to_csv("/content/drive/MyDrive/工作效率神器OpenAI/ChatGLM_personalKhowledge/GLM_model_verified.csv", index=False)

# AI 验证和压缩率计算
first_file = "/content/drive/MyDrive/工作效率神器OpenAI/ChatGLM_personalKhowledge/GLM_model.csv"
second_file = "/content/drive/MyDrive/工作效率神器OpenAI/ChatGLM_personalKhowledge/GLM_model_verified.csv"
```

## 1.安装依赖
```shell script
pip install pandas
pip install typer
pip install loguru
```
## Define functions
```shell script
import typer
from loguru import logger
app = typer.Typer()
import pandas as pd


def check_is_equal(first_file=None, second_file=None):
    df1 = pd.read_csv(first_file,encoding='latin1')
    all_counts = df1.shape[0]
    df2 = pd.read_csv(second_file,encoding='latin1')
    df_all = pd.merge(df1, df2, on= "id")
    #print(df_all.head())

    glm_counts = df_all[df_all["GLM_Response_x"] == df_all["GLM_Response_y"]].shape[0]
    if glm_counts == all_counts:
        logger.info(f"{first_file} GLM_Response equal {second_file} ; total_counts: {all_counts}, GLM_counts: {glm_counts} ")
    else:
        logger.warning(f"{first_file} GLM_Response not equal {second_file} please check it ")


def compression_rate(file=None):
    df = pd.read_csv(file,encoding='latin1')
    #print(df.head())
    total_rows = df.shape[0]
    correct_rows = df[df["Formatted_response_y"] == df["Correct_answer"]].shape[0]
    model_parameters = 6500000000
    training_set = 1099511627776
    #training_set = df["training_set"].iloc[0]
    correct_rate = correct_rows/total_rows
    compression_rate = 1 - model_parameters / training_set * correct_rate
    compression_rate = int(compression_rate * 100)
    logger.info(f"compression_rate is {compression_rate} %")

```
### Print the result
``` shell script
check_is_equal(first_file, second_file) #Check if the two files are equal
compression_rate(file=second_file) #Calculate the compression rate
``` 

### 2. check 固定随机种子确定两次模型是否一致
```shell script
${PYTHON_HOME}/bin/python pivot_ai.py  check-is-equal --first_file ${first_file} --second_file ${second_file}
```

### 2. 计算压缩率
```shell script
${PYTHON_HOME}/bin/python pivot_ai.py  comression-rate --file ${file}
```
