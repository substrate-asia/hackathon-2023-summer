
import typer
from loguru import logger
app = typer.Typer()
import pandas as pd



@app.command()
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

@app.command()
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

if __name__ == '__main__':
    app()



