@echo off
pushd backend
python -m venv .venv
call .venv\Scripts\activate
uv pip install -r requirements.txt
popd
set "GKEEP_TOKEN=aas_et/AKppINa13d7YkmEkTlla3f3yMQtWlM3mEO9o_20mHkK2sk5m2uMuFS2e9tA23Qi5j692aZhHdVfleysP5O82EzrahGd0A7EKez6VkuNlMta1XE8SGR7zECSG-667KhS0OxTkufO6DjECIIwBndgQ9MTDt0nFjAHu8hyQhXsCKxoFqmtbSH8Nes9yGCQw50OEdPWmjWFg4vWxBePgvtoa7xI="
settimeout 1 && cmd /c "python -m fastapi dev backend\main.py"
start "" "http://localhost:8000"
pause