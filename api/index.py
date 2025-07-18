from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import requests
import xml.etree.ElementTree as ET
from mangum import Mangum

app = FastAPI()

# 국가법령정보센터 API 설정
API_KEY = "jocu1004@gmail.com"  # ✅ 본인 OC 키 그대로
BASE_URL = "https://www.law.go.kr/DRF/lawSearch.do"

@app.get("/api/search")
async def search(keyword: str = Query(..., description="검색할 키워드")):
    try:
        # API 호출 URL
        url = f"{BASE_URL}?OC={API_KEY}&target=law&query={keyword}&type=XML"

        # 요청
        response = requests.get(url)
        if response.status_code != 200:
            return JSONResponse(
                status_code=response.status_code,
                content={"error": f"국가법령정보 API 오류. 상태코드: {response.status_code}"}
            )

        # XML 파싱
        root = ET.fromstring(response.content)
        items = root.findall(".//법령명한글")
        results = [item.text for item in items]

        return {"query": keyword, "laws": results}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"서버 에러: {str(e)}"}
        )

# Vercel 서버리스용 핸들러
handler = Mangum(app)
