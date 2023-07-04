
import typer
from loguru import logger
app = typer.Typer()
import pandas as pd



@app.command()
def check_is_equal(first_file=None, second_file=None):
    df1 = pd.read_csv(first_file)
    all_counts = df1.shape[0]
    df2 = pd.read_excel(second_file)
    df_all = pd.merge(df1, df2, on= "id")
    falcon_counts = df_all[df_all["falcon_answer_x"] == df_all["falcon_answer_y"]].shape[0]
    if falcon_counts == all_counts:
        logger.info(f"{first_file} falcon_answer equal {second_file} ; total_counts: {all_counts}, falcon_counts: {falcon_counts} ")
    else:
        logger.warning(f"{first_file} falcon_answer not equal {second_file} please check it ")


def comression_rate(file=None):
    df = pd.read_csv(file)
    total_rows = df.shape[0]
    correct_rows = df[df["falcon_answer"] == df["correct_answer"]].shape[0]
    model_parameters = df["model_parameters"].iloc[0]
    training_set = df["training_set"].iloc[0]
    correct_rate = correct_rows/total_rows
    compression_rate = 1 - model_parameters / training_set * correct_rate
    compression_rate = int(comression_rate * 100)
    logger.info(f"compression_rate is {compression_rate} %")

if __name__ == '__main__':
    app()



