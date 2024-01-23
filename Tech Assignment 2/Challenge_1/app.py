from fastapi import FastAPI, Request, Form
from fastapi. responses import Response
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

# mount public folder so any requests that start with /public/ will use this
app.mount("/public", StaticFiles(directory="public"), name="public")

@app.get("/", response_class=HTMLResponse)
def index():
    with open("index.html") as html:
        return HTMLResponse(content=html.read())


@app.get("/case_studies", response_class=HTMLResponse)
def case_studies():
    with open("case_studies.html") as html:
        return HTMLResponse(content=html.read())

@app.get("/favicon.ico", response_class=FileResponse)
def favicon():
    return FileResponse(path="public/favicon.ico", media_type="image/ico")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
