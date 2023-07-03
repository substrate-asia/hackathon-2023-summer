import logging
import requests
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
from requests.exceptions import RequestException

class BinanceAPI:
    def __init__(self):
        # self.base_url = "https://api.binance.com/api/v3"
        self.base_url = "https://api.binance.us/api/v3"
    
        # Start with past midnight today
        self.end_dt = datetime.today()
        self.start_dt = self.end_dt - timedelta(hours=24) # Get past 24 hours

        self.df_columns = ['open_time', 'close_time', 'open', 'high', 'low', 'close', 
                'volume', 'quote_asset_volume', 'num_trades', 'taker_buy_base_asset_volume', 
                'taker_buy_quote_asset_volume', 'ignore', 'open_timestamp', 'close_timestamp']

        self.df_columns_2 = [
            'open_timestamp', 'open', 'high', 'low', 'close', 
            'volume', 'close_timestamp', 'quote_asset_volume', 
            'num_trades', 'taker_buy_base_asset_volume', 
            'taker_buy_quote_asset_volume', 'ignore'
        ]

    def get_historical_price(self, symbol: str, currency: str, interval: str, time_range: list) -> pd.DataFrame:

        # Convert start and end time strings to datetime objects
        try:
            start_time = datetime.fromisoformat(time_range[0].strip())

            # print("start_time:",start_time)
        
            end_time = datetime.fromisoformat(time_range[1].strip())

            # print("end_time:",end_time)

        except (ValueError, TypeError, IndexError):
            # Use default values if time_range is invalid or None
            start_time = self.start_dt
            end_time = self.end_dt
        
        # Determine the start and end timestamps based on start_time and end_time
        if (end_time - start_time).total_seconds() < 600.0:
            # time range shorter than 10 min
            start_timestamp = round(self.start_dt.timestamp() * 1000)
            end_timestamp = round(self.end_dt.timestamp() * 1000)
        else:
            start_timestamp = round(start_time.timestamp() * 1000)
            end_timestamp = round(end_time.timestamp() * 1000)

            print("start_timestamp:",start_timestamp)
            print("end_timestamp:",end_timestamp)
        
    
        # Log request information
        logging.info(f'start_timestamp: {start_timestamp}, end_timestamp: {start_timestamp}, symbol: {symbol}, kline_time_interval: {interval}')


        print("K线参数:",start_timestamp,end_timestamp,symbol,interval)

        try:
            # Make request to API endpoint with specified parameters
            r = requests.get(f'{self.base_url}/klines?symbol={symbol}{currency}&interval={interval}&startTime={start_timestamp}&endTime={end_timestamp}&limit=3000')
            content = json.loads(r.content)
            # print("content:",content)
        
        except RequestException as e:
            
            # Log error message if request fails
            logging.error(f"Error occurred while fetching data: {e}")
            return None

        if (len(content) > 0):
            
            # Convert API response to pandas DataFrame
            df = pd.DataFrame.from_records(content, columns=self.df_columns_2)
            
            # Convert timestamps to datetime objects for readability
            df['open_time'] = df.open_timestamp.apply(lambda ts: datetime.fromtimestamp(ts/1000))
            df['close_time'] = df.close_timestamp.apply(lambda ts: datetime.fromtimestamp(ts/1000))
            
            # Return selected columns of DataFrame, sorted by open_time in descending order
            return df[self.df_columns].sort_values('open_time', ascending=False).to_dict(orient='records')
        
        else:
            # Log error message if API response is empty
            logging.error('NO DATA RETRIEVED')
            logging.error(f'RESPONSE: {content}')
            return None


binance_api = BinanceAPI()