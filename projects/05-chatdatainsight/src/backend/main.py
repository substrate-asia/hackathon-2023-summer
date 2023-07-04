import uvicorn
import certifi
import os
import sys

from decouple import config
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient


from api.v1.endpoints import dp_openai
from api.v1.endpoints import binance
from api.v1.endpoints import news
from api.v1.endpoints import insight

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# current_directory = os.path.dirname(os.path.realpath(__file__))
# backend_directory = os.path.abspath(os.path.join(current_directory,".."))
# sys.path.insert(0, backend_directory)

# current_directory = os.getcwd()
# print(current_directory)

# print(os.getcwd())

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


DB_URL = config("DB_URL", cast=str)
DB_NAME = config("DB_NAME", cast=str)


origins = [
    "http://localhost:3000",
    "http://137.184.5.217",
    "http://demo.chatdatainsight.com",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(DB_URL,tlsCAFile=certifi.where())
    app.mongodb = app.mongodb_client[DB_NAME]


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Add the routers
app.include_router(dp_openai.router)
app.include_router(binance.router)
app.include_router(news.router)
app.include_router(insight.router)


if __name__ == "__main__":
    
    # uvicorn.run("main:app", reload=True, host='0.0.0.0', port=3005) # production
    uvicorn.run("main:app", reload=True, host='0.0.0.0', port=3006) # development