from fastapi import FastAPI, Request, Form
from fastapi. responses import Response
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def index():
    with open("index.html") as html:
        return HTMLResponse(content=html.read())


@app.get("/world_clock", response_class=HTMLResponse)
def world_clock():
    with open("world_clock.html") as html:
        return HTMLResponse(content=html.read())

@app.get("/favicon.ico", response_class=FileResponse)
def favicon():
    return FileResponse(path="static/favicon.ico", media_type="image/ico")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
