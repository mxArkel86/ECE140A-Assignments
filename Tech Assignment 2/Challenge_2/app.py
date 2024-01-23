from fastapi import FastAPI, Request, Form, BackgroundTasks
from fastapi.responses import Response
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from urllib.request import urlopen
import json

app = FastAPI()

app.mount("/public", StaticFiles(directory="public"), name="public")


@app.get("/", response_class=HTMLResponse)
def index():
    with open("index.html") as html:
        return HTMLResponse(content=html.read())


@app.get("/page", response_class=HTMLResponse)
def page():
    with open("page.html") as html:
        return HTMLResponse(content=html.read())


with open("api_key.txt", "r") as f:
    api_key = f.read()

stock_data = {}


def post_stocks(stock1, stock2, stock3):
    for i, stock in enumerate([stock1, stock2, stock3]):
        stock = stock.upper()
        url = 'https://financialmodelingprep.com/api/v3/profile/' + stock + '?apikey=' + api_key

        response = urlopen(url)
        data_json = json.loads(response.read())
        if len(data_json) == 0:
            print(f"{stock} [{i}] does not exist")
            stock_data[i + 1] = "invalid"
            continue

        ret_data = data_json[0]
        # print(ret_data)


        stock_data[i + 1] = {"companyName": ret_data["companyName"],
                             "industry": ret_data["industry"],
                             "sector": ret_data["sector"],
                             "price": ret_data["price"]}


@app.post("/stock", response_class=RedirectResponse)
async def stock_post_form(background_tasks: BackgroundTasks, stock1: str = Form(...),
                          stock2: str = Form(...), stock3: str = Form(...)):
    background_tasks.add_task(post_stocks, stock1, stock2, stock3)

    return RedirectResponse(url="/page", status_code=303)


@app.get("/stock/{number}", response_class=JSONResponse)
async def stock_get(number: int):
    if number <= 0 or number > 3:
        return {"error": "out of range"}

    if number not in stock_data.keys():
        return {"error": "data does not exist yet"}

    if stock_data[number] == "invalid":
        return {"error": "invalid ticker symbol - does not exist"}

    return stock_data[number]


@app.get("/favicon.ico", response_class=FileResponse)
def favicon():
    return FileResponse(path="public/favicon.ico", media_type="image/ico")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
