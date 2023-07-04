from decouple import config

class Config:
         
    OPENAI_API_KEY = config("OPENAI_API_KEY", cast=str)
    MODEL_NAME = config("MODEL_NAME",cast=str)
    PROMPT_FILE = config("PROMPT_FILE", cast=str)
    COIN_SYMBOLS = config("COIN_SYMBOLS", cast=str)
    # PROMPT_FILE_KAHIN = config("PROMPT_FILE_KAHIN", cast=str)
    NEWS_API_KEY = config("NEWS_API_KEY", cast=str)
    QUICKNODE_ENDPOINT = config("QUICKNODE_ENDPOINT", cast=str)
    QUICKNODE_API_KEY = config("QUICKNODE_API_KEY", cast=str)

    JUDGEMENT_PROMPT = config("JUDGEMENT_PROMPT", cast=str)
    BINANCE_PROMPT = config("BINANCE_PROMPT", cast=str)
    NEWS_PROMPT = config("NEWS_PROMPT", cast=str)