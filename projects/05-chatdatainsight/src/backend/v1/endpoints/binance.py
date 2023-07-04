from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import asyncio

from services.binance import binance_api
from ..helpers.descriptive_stats import DescriptiveStats

router = APIRouter()

numeric_columns = ['open', 'high', 'low', 'close', 
                'volume', 'quote_asset_volume', 'num_trades',]


# --------------- GET ----------------- # 
@router.get(
        "/api/v1/binance", 
        response_description="List binance data",
        responses={404: {"description": "Not found"}}
)
async def get_binance_data(
    symbol: str, 
    currency: str, 
    klines: str, 
    dataframe: str,
):
    try:
        data = binance_api.get_historical_price(symbol, currency, klines, [dataframe, dataframe])
        
        _df = pd.DataFrame(data)[numeric_columns]
        _df = _df.apply(pd.to_numeric, errors='coerce')

        loop = asyncio.get_running_loop()
        stats_task = loop.run_in_executor(None, DescriptiveStats.get_dataframe_stats, _df)
        stats_json = await stats_task  # wait for the task to complete and get the result
        
        # Save stats_json to the database or return it in the API response


        return data
    
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

    

# --------------- POST ----------------- #

# --------------- PUT ----------------- #

# --------------- DELETE ----------------- #

# --------------- PATCH ----------------- #

# --------------- OPTIONS ----------------- #

# --------------- HEAD ----------------- #

# --------------- TRACE ----------------- #

# --------------- CONNECT ----------------- #

