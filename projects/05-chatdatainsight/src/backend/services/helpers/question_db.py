from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# from main import app

# Data Pydantic model
class Data(BaseModel):
    question: str
    answer: str
    error: Optional[str] = None

class ErrorQuestionRecord():
    def __init__(self):
        collection = app.mongodb["chatadata-insight-collection"]
        collection.createIndex( {'question':1} )

    @classmethod
    # insert data
    async def insert_error_data(cls, question: str, answer: str, error: str):
        collection = app.mongodb["chatadata-insight-collection"]  
        data = Data(question=question, answer=answer, error=error)
        data_dict = data.dict()
        result = await collection.insert_one(data_dict)
        if result:
            return {"status": "data inserted successfully"}
        else:
            raise HTTPException(status_code=400, detail="Insertion failed")

