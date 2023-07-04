from fastapi import FastAPI
from .dashboard import dashboard_router

def include_routers(app: FastAPI):
    app.include_router(dashboard_router)