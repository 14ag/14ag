@echo off
goto :main


:put
curl -g -X PUT "http://127.0.0.1:8000/projects" ^
    -H "Content-Type: application/json" ^
    -d "{\"project-repo\":{\"title\":\"test title\",\"description\":\"long description man\",\"techs\":[\"java\", \"screen\"],\"_url\":\"https://github.com/14ag/blinter-vscode-extension\",\"category\":\"extensions\"}}"
exit /b


:get
curl -g -X GET "http://127.0.0.1:8000/projects"
exit /b


:get-cors
curl -I -X OPTIONS http://localhost:8000/projects ^
  -H "Origin: http://localhost:3000" ^
  -H "Access-Control-Request-Method: GET"
exit /b


:main
call :get-cors
echo done
pause >nul

