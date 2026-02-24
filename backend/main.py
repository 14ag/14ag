from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
import json
import gkeepapi
import os


class Content(BaseModel):
    title: str
    body: str


app = FastAPI()


@app.get("/")
async def test_function():
    return "Hello, World!"


@app.get("/projects")
async def get_project_info():
    try:
        with open(r"data.json" "r") as project_data_file:
            project_data_content=json.loads(project_data_file.read())

    except:
        return "could not get projects"

    return project_data_content


@app.post("/message")
async def receive_message(message_content: dict[str,str]):
    try:
        master_token=str(os.getenv("GKEEP_TOKEN"))

        keep = gkeepapi.Keep()
        keep.authenticate('user@gmail.com', master_token)
        
        note_body_content="".join(x for x in message_content.values())
        note = keep.createNote('portfolio_dms', note_body_content)
        note.pinned = True
        note.color = gkeepapi.node.ColorValue.Red

        keep.sync()

        print(note.title)
        print(note.text)
        return
    except:
        return {"message":"failiure"}


# remove a project
@app.delete("/projects")
async def remove_project(project_key: str):
    try:
        try:
            with open(r"data.json", "rw") as project_data_file:
                project_data_file_content=json.loads(project_data_file.read())
                project_data_file_content.pop(project_key)
                project_data_file.write(json.dumps(project_data_file_content))
        except:
            return
        return
    except:
        return {"message":"failiure"}
    

# modify a project
@app.put("/projects")
async def modify_projects(project_content: Dict[str,str]):
    try:
        try:
            with open(r"data.json", "rw") as project_data_file:
                project_data_file_content=json.loads(project_data_file.read())
                for key,value in project_content.items():
                    project_data_file_content[key]=project_content[value]

                project_data_file.write(json.dumps(project_data_file_content))

        except:
            return
        return
    except:
        return {"message":"failiure"}
    




