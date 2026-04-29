import React, { useEffect, useState, useRef } from "react";

export default function Connections({ boardAddress, userName }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(
            `ws://130.49.148.168:8448/ws/${boardAddress}/${userName}`
        );

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "connections") {
                setUsers(data.users);
            } else {
                setMessages((prev) => [...prev, data.message]);
            }
        };

        ws.current.onclose = () => {
            console.log("Disconnected");
        };

        return () => {
            ws.current.close();
        };
    }, [boardAddress, userName]);

    const handleClick = () => {
        ws.current.send(
            JSON.stringify({
                type: "button_click",
            })
        );
    };

    return (
        <div>
            <h3>Подключённые пользователи:</h3>
            <ul>
                {users.map((u, i) => (
                    <li key={i}>{u}</li>
                ))}
            </ul>

            <button onClick={handleClick}>
                Нажать кнопку
            </button>

            <h3>Сообщения:</h3>
            <div>
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
        </div>
    );
}