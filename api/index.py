from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Vercel FastAPI 기본 동작 성공!"}

@app.get("/api")
def api_root():
    return {"message": "API 엔드포인트 정상"}

@app.get("/api/search")
def search(keyword: str):
    return {"result": f"검색 키워드: {keyword}"}
