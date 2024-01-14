from fastapi import FastAPI
from fastapi.responses import Response, HTMLResponse
import uvicorn
from starlette.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def index() -> Response:
    with open("index.html") as html:
        return HTMLResponse(content=html.read())


# Running the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6543)
