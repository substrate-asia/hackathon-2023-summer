from services.news import news_api
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

# --------------- GET ----------------- # 

@router.get(
        "/api/v1/news", 
        response_description="List news related to certain coin",
        responses={404: {"description": "Not found"}}
)
async def get_binance_data(symbol: str):
    try:
        news = news_api.get_top_headlines(symbol)
        return news

    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})
