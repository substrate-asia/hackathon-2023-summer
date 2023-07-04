from fastapi import APIRouter, Response
from fastapi.responses import StreamingResponse
from services.insight import chatdata_insight
from services.helpers.chat_tools import stream_output as output

import base64
import os
import asyncio

router = APIRouter()


@router.get(
    "/api/v1/insight", 
    response_description="List ethereum data",
    responses={404: {"description": "Not found"}}
)
def analyze_prompt(prompt: str):
    
    res = chatdata_insight(prompt)

    return output(res)