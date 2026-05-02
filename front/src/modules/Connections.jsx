import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/Connections.module.css";

export default function Connections({ boardAddress, userName }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        fetch(`http://130.49.148.168:8448/links/${boardAddress}`)
        .then(res => res.json())
        .then(data => {setUsers(data);console.log(data);}); 
    }, [boardAddress]);

    useEffect(() => {
        ws.current = new WebSocket(
            `ws://130.49.148.168:8448/ws/${boardAddress}/${userName}`
        );

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "connections") {
                setOnlineUsers(data.users);
                console.log(data.users);
            } else {
                setMessages((prev) => [...prev, data.message]);
            }
        };

        ws.current.onclose = (event) => {
            if (event.wasClean) {
                console.log("Disconnected cleanly");
            } else {
                console.log("Unexpected disconnect");
            }
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
            <h3>Пользователи:</h3>
            <ul>
                {users.map((user) => {
                    return (
                    <li 
                    className={onlineUsers.includes(user.username) ? styles.online : ""}
                    key={user.user_id}>
                            {user.username}
                    </li>)
                })}
            </ul>
        </div>
    );
}