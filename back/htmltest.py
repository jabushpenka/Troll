html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Доска</title>
    </head>
    <body>
        <h1>Доска</h1>
        <h2>Ваше имя: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var user_name = "user"+Date.now()
            document.querySelector("#ws-id").textContent = user_name;
            
            var currentURL = window.location.href;
            var board_address = currentURL.substring(currentURL.lastIndexOf('/') + 1);
            
            var ws = new WebSocket(`ws://localhost:8000/ws/${board_address}/${user_name}`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""