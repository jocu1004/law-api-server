from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests
import xml.etree.ElementTree as ET
from urllib.parse import unquote

app = FastAPI()
API_KEY = "jocu1004"  # ✅ 이메일 전체 X, ID 부분만 O

@app.get("/search")
def search(keyword: str):
    try:
        keyword = unquote(keyword)
        result = ""

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
        }

        # 법령 검색
        law_url = f"https://www.law.go.kr/DRF/lawSearch.do?OC={API_KEY}&target=law&query={keyword}&type=XML"
        law_response = requests.get(law_url, headers=headers)

        if law_response.status_code == 200:
            root = ET.fromstring(law_response.content)
            laws = [law.find('법령명').text for law in root.findall('law')]
            result += f"📘 관련 법령: {', '.join(laws[:5])}\n" if laws else "📘 관련 법령 없음\n"
        else:
            result += "⚠️ 법령 API 호출 실패\n"

        # 판례 검색
        case_url = f"https://www.law.go.kr/DRF/lawSearch.do?OC={API_KEY}&target=prec&query={keyword}&type=XML"
        case_response = requests.get(case_url, headers=headers)

        if case_response.status_code == 200:
            root = ET.fromstring(case_response.content)
            cases = [case.find('사건명').text for case in root.findall('prec')]
            result += f"⚖️ 관련 판례: {', '.join(cases[:5])}\n" if cases else "⚖️ 관련 판례 없음\n"
        else:
            result += "⚠️ 판례 API 호출 실패\n"

        return {"result": result}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
