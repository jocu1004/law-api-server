from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/api/search")
async def search(keyword: str):
    return {"result": f"검색 키워드: {keyword}"}

# Mangum handler
handler = Mangum(app)
