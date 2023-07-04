import requests

from core.config import Config


class NewsAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2/everything?"
        self.sortBy = "popularity"


    def get_top_headlines(self, coin):

        #{'status': 'error', 'code': 'parameterInvalid', 'message': 'You are trying to request results too far in the past. Your plan permits you to request articles as far back as 2023-03-01, but you have requested 2023-01-01. You may need to upgrade to a paid plan.'}
        _from = "2023-05-05" #date.date()

        url = (
            f'{self.base_url}'
            f'q={coin}&'
            f'from={_from}&'
            'sortBy=popularity&'
            f'apiKey={self.api_key}'
        )

        response = requests.get(url)
        return response.json().get('articles')
    
news_api = NewsAPI(Config.NEWS_API_KEY)