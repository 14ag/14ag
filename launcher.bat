@echo off
pushd backend
python -m venv .venv
call .venv\Scripts\activate
uv pip install -r requirements.txt
popd
settimeout 1 && cmd /c "python -m fastapi dev backend\main.py"
start "" "http://localhost:8000"
pause