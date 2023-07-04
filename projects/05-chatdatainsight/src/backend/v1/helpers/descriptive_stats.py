import pandas as pd
import json
import numpy as np

class DescriptiveStats:

    @staticmethod
    def get_dataframe_stats(dataframe):
        df = np.round(dataframe.describe(), 4)
        return df.to_json(orient='columns')
