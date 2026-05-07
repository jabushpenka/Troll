import { useEffect, useRef, useState } from "react";

export function useConnections({ boardAddress, userName, onMessage }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const ws = useRef(null);
  // загрузка пользователей
  useEffect(() => {
    if (!boardAddress) return;

    fetch(`http://130.49.148.168:8448/links/${boardAddress}`)
      .then((res) => res.json())
      .then(setUsers);
  }, [boardAddress]);

  // websocket
  useEffect(() => {
    if (!boardAddress || userName == null) return;
    ws.current = new WebSocket(
      `ws://130.49.148.168:8448/ws/${boardAddress}/${userName}`
    );

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage?.(data);

      //здесь только то, что нужно обрабатывать непосредственно в этом хуке
      if (data.type === "connections") {
        setOnlineUsers(data.users);
      } 
    };

    return () => ws.current.close();
  }, [boardAddress, userName]);

  // методы
  const send = (payload) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    }
  };

  const updateBoard = () => {
    send({ type: "board_update" });
  };

  return {
    users,
    onlineUsers,
    updateBoard,
  };
}