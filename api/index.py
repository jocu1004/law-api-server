from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/api")
async def root():
    return {"message": "Vercel FastAPI basic working!"}

handler = Mangum(app)
