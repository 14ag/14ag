@echo off
curl -g -X PUT "http://127.0.0.1:8000/projects" ^
    -H "Content-Type: application/json" ^
    -d "{\"project-repo\":{\"title\":\"test title\",\"description\":\"long description man\",\"techs\":[\"java\", \"screen\"],\"_url\":\"https://github.com/14ag/blinter-vscode-extension\",\"category\":\"extensions\"}}"
pause >nul