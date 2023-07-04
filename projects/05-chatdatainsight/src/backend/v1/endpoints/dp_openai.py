import os
import sys
current_directory = os.path.dirname(os.path.realpath(__file__))
root_directory = os.path.abspath(os.path.join(current_directory, '..', '..', '..'))

sys.path.insert(0, root_directory)

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from typing import List
from fastapi import APIRouter, Request, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from api.v1.models.openai import ChatDB
from services.dp_openai import get_completion

router = APIRouter()


# --------------- GET ----------------- # 

@router.get(
        "/api/v1/openai/", 
        response_description="List complete chat history",
        responses={404: {"description": "Not found"}}
)

async def list_chat_completion_history (request: Request, skip: int = 0, limit: int = 100) -> List[ChatDB]:
    try:
        projection = {"_id": 1, "prompt": 1, "completion": 1, "created_at": 1 }
        full_query = request.app.mongodb['polardash'].find({}, projection).sort([('_id', -1)]).skip(skip).limit(limit)

        results = [ChatDB(**chat) async for chat in full_query]

        return results

    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

# --------------- POST ----------------- # 
@router.post(
    "/api/v1/openai/", 
    response_description="Save OpenAI response",
    responses={404: {"description": "Not found"}}
)
async def save_openai_response(request: Request, user_prompt: ChatDB = Body(...)):
    message = [
        {"role": "user", "content": str(user_prompt.prompt)}
    ]
    try:
        
        #Its here the explanation of the graph goes... Need to call another function. 
        user_prompt.completion = await get_completion(message)

        je = jsonable_encoder(user_prompt)

        result = await request.app.mongodb["polardash"].insert_one(je)
        inserted_id = result.inserted_id

        created_prompt = await request.app.mongodb["polardash"].find_one(
            {"_id": str(result.inserted_id)},
            projection={"_id": 1, "prompt": 1, "completion": 1, "created_at": 1 },
        )

        if created_prompt is None:
            raise HTTPException(status_code=404, detail="Chat not found")

        return {"id": inserted_id, **created_prompt}

    except (TypeError, AttributeError, ValueError) as e:
        raise HTTPException(status_code=400, detail="Invalid input data")

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")




# --------------- PUT ----------------- #

# --------------- DELETE ----------------- #

# --------------- PATCH ----------------- #

# --------------- OPTIONS ----------------- #

# --------------- HEAD ----------------- #

# --------------- TRACE ----------------- #

# --------------- CONNECT ----------------- #

