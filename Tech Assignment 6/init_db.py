from fastapi import FastAPI, Request, Form
from fastapi.responses import Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles   # Used for serving static files
import uvicorn
import os


import json
import mysql.connector as mysql
from dotenv import load_dotenv

load_dotenv()

db_pass = os.environ['MYSQL_ROOT_PASSWORD']

if __name__ == "__main__":
    db = mysql.connect(host="127.0.0.1", user="root", passwd=db_pass)

    # preparing a cursor object
    cursor = db.cursor()

    cursor.execute("SHOW DATABASES;")

    databases = [database[0] for database in cursor.fetchall()]
    if "TechAssignment6" in databases:
        cursor.execute("DROP DATABASE TechAssignment6;")

    cursor.execute("CREATE DATABASE TechAssignment6;")

    cursor.execute("USE TechAssignment6;")

    cursor.execute("""CREATE TABLE Menu_items (
        item_id			INT NOT NULL auto_increment,
        name		    VARCHAR(50) NOT NULL,
        price	        INT NOT NULL,
        primary key (item_id))""")

    cursor.execute("""CREATE TABLE Orders (
            order_id			INT NOT NULL auto_increment,
            item_id		        INT NOT NULL,
            name	            VARCHAR(100) NOT NULL,
            quantity            SMALLINT NOT NULL,
            status              BIT(1),
            primary key (order_id))""")

    # STATUS [0] = pending. [1] = complete
    db.commit()

    cursor.close()

    db.close()





