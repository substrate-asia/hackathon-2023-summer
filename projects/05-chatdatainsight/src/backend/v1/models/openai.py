from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional
import json
from datetime import datetime


# Define custom JSON encoder for ObjectId
class _CustomJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)


#-----------------_PyObjectId-----------------#
class _PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid object id")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


#-----------------_MongoBaseModel-----------------#
class _MongoBaseModel(BaseModel):
    id: _PyObjectId = Field(default_factory=_PyObjectId, alias="_id")


    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: _CustomJsonEncoder().default
        }
    
#-----------------ChatDB-----------------#
class ChatDB(_MongoBaseModel):
    prompt: str = Field(..., min_length=1, alias="prompt")
    completion: Optional[str] = Field(min_length=1, alias="completion")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")





