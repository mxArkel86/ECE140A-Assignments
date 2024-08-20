from typing import Any

from fastapi import FastAPI, Request, Form, status, Body
from fastapi.responses import Response
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from dotenv import load_dotenv
import os
import mysql.connector as mysql
import re

load_dotenv()

db_pass = os.environ['MYSQL_ROOT_PASSWORD']

db = mysql.connect(host="127.0.0.1", user="root", passwd=db_pass, db="TechAssignment6")
cursor = db.cursor()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=RedirectResponse)
def index():
    return RedirectResponse(url="/order")


@app.get("/order", response_class=HTMLResponse)
def order_main_page():
    with open("order.html") as html:
        return HTMLResponse(content=html.read())


@app.get("/admin", response_class=HTMLResponse)
def admin_main_page():
    with open("admin.html") as html:
        return HTMLResponse(content=html.read())


@app.get("/favicon.ico", response_class=FileResponse)
def favicon():
    return FileResponse(path="static/favicon.ico", media_type="image/ico")


@app.get("/orders", response_class=JSONResponse)
def get_orders():
    cursor.execute("""SELECT order_id,Menu_items.item_id,Menu_items.name,Orders.name,quantity,status FROM Orders \
    left join Menu_items on Menu_items.item_id=Orders.item_id;""")

    data = cursor.fetchall()

    return {
        "data": list({"id": x[0], "item_id": x[1], "item_name": x[2], "cust_name": x[3], "quantity": x[4], "status": x[5]} for x in data)
    }


@app.get("/menu", response_class=JSONResponse)
def get_menu():
    cursor.execute("SELECT item_id,name,price FROM Menu_items;")

    data = cursor.fetchall()

    return {
        "data": list({"id": x[0], "name": x[1], "price": x[2]} for x in data)
    }


@app.post("/menu", response_class=JSONResponse)
def add_to_menu(name: str = Form(...), price: int = Form(...)):
    if price < 0 or price > 999:
        return {"error": "price is not within expected range of 0 to 999"}

    if not (3 <= len(name) <= 50):
        return {"error": "item name does not meet minimum/maximum length requirements"}

    if not re.match(r"^[\w\- ]+$", name):
        return {"error": "item name includes invalid characters"}

    cursor.execute("INSERT INTO Menu_items (name,price) VALUES (%s, %s);", (name, price,))

    db.commit()

    cursor.execute("SELECT LAST_INSERT_ID();")
    id_ = cursor.fetchone()[0]

    return {
        "data": {
            "id": id_
        }
    }


@app.put("/menu/{item_id}", response_class=JSONResponse)
def modify_menu_item(item_id: int, name: str = Form(...), price: int = Form(...)):
    if item_id < 1:
        return {"error": "item id is invalid"}

    if price < 0 or price > 999:
        return {"error": "price is not within expected range of 0 to 999"}

    if not (3 <= len(name) <= 50):
        return {"error": "item name does not meet minimum/maximum length requirements"}

    if not re.match(r"^[\w\- ]+$", name):
        return {"error": "item name includes invalid characters"}

    cursor.execute("SELECT COUNT(name) FROM Menu_items WHERE item_id=%s;", (item_id,))
    num = cursor.fetchone()[0]
    if num == 0:
        return {"error": "a menu item with that id does not exist. it may have already been deleted"}

    cursor.execute("UPDATE Menu_items SET name=%s,price=%s WHERE item_id=%s;",
                   (name, price, item_id,))

    db.commit()
    return {}


@app.delete("/menu/{item_id}", response_class=JSONResponse)
def remove_menu_item(item_id: int):
    if item_id < 1:
        return {"error": "invalid id"}

    # check if the item has been deleted already
    cursor.execute("SELECT COUNT(name) FROM Menu_items WHERE item_id=%s;", (item_id,))
    num = cursor.fetchone()[0]
    if num == 0:
        return {"error": "a menu item with that id does not exist. it may have already been deleted"}

    # delete the item
    cursor.execute("DELETE FROM Menu_items WHERE item_id=%s;", (item_id,))
    # delete orders which ask for that item
    cursor.execute("DELETE FROM Orders WHERE item_id=%s;", (item_id,))

    db.commit()

    return {}


@app.delete("/order/{order_id}", response_class=JSONResponse)
def delete_order(order_id: int):
    if order_id < 1:
        return {"error": "invalid id"}

    # check if the order has already been deleted
    cursor.execute("SELECT COUNT(name) FROM Orders WHERE order_id=%s;", (order_id,))
    num = cursor.fetchone()[0]
    if num == 0:
        return {"error": "an order with that id does not exist. it may have already been deleted"}

    cursor.execute("DELETE FROM Orders WHERE order_id=%s;", (order_id,))

    db.commit()

    return {}

def intTryParse(value):
    try:
        return int(value), True
    except ValueError:
        return value, False

@app.put("/order/{order_id}", response_class=JSONResponse)
def mark_order_status(order_id: int, data: Any = Body(None)):
    if order_id < 1:
        return {"error": "invalid id"}

    status_, valid = intTryParse(data["status"])
    if not valid:
        return {"error": "status is not of type int"}

    if status_ != 0 and status_ != 1:
        return {"error": "invalid status value (0 or 1)"}

    cursor.execute("UPDATE Orders SET status=%s WHERE order_id=%s;",
                   (status_, order_id,))

    db.commit()

    return {}


@app.post("/order", response_class=JSONResponse)
def submit_order(id: int = Form(...), cust_name: str = Form(...), quantity: int = Form(...)):
    if id < 1:
        return {"error": "item id is invalid"}

    if quantity < 1 or quantity > 999:
        return {"error": "quantity is not within expected range of 1 to 999"}

    if not (3 <= len(cust_name) <= 100):
        return {"error": "customer name does not meet minimum/maximum length requirements"}

    if not re.match("^[A-z ]+$", cust_name):
        return {"error": "customer name includes invalid characters"}

    cursor.execute("SELECT COUNT(item_id) FROM Menu_items WHERE item_id=%s;", (id,))
    num = cursor.fetchone()[0]
    if num==0:
        return {"error": "an item with that id does not exist on the menu"}

    cursor.execute("INSERT INTO Orders (item_id, name, quantity, status) VALUES (%s,%s,%s,0);",
                   (id, cust_name, quantity))

    db.commit()

    cursor.execute("SELECT LAST_INSERT_ID();")
    id_ = cursor.fetchone()[0]

    return {
        "data": {"id": id_}
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
