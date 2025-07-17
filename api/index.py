from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Vercel FastAPI 기본 동작 성공!"}

@app.get("/search")
def search(keyword: str):
    return {"result": f"당신이 검색한 키워드는: {keyword}"}
