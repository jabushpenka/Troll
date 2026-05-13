import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLoaderData } from "react-router-dom";
import {createBrowserRouter, RouterProvider, redirect} from "react-router-dom";
import Board from "./modules/Board.jsx";
import Register from "./modules/Register.jsx";
import Boardslist from "./modules/Boardslist.jsx";
import Layout from "./Layout.jsx";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { useNavigation } from './hooks/Navigation.jsx';
import { createBoard } from './api.jsx';
import styles from "./styles/Home.module.css";
import {nanoid} from "nanoid";

function Home() {
  const boards = useLoaderData();
 /*LIST OF OBJECTS{ board_id: 28, board_name: "New Board", address: "rHKzQ6Z_0z", about: "Board description", contents: {…} } */
  const {openBoard} =  useNavigation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const username = user.user_name;

  const Modal = ({ isOpen, onClose, address, initialName, initialAbout, isEdit}) => { 
    const [boardName, setBoardName] = useState("");
    const [about, setAbout] = useState("");

    const [activeAddUser, setActiveAddUser] = useState(false);
    const [addUsernameValue, setAddUsernameValue] = useState("");
    const [selectedRole, setSelectedRole] = useState("Worker");
    const [users, setUsers] = useState([])

    //1 - Owner 2 - Administrator 3 - Manager 4 - Worker
    const roleNamesRu = {
      1: "Владелец",
      2: "Администратор",
      3: "Менеджер",
      4: "Сотрудник",
    }

    const roleClassMap = {
      1: "owner",
      2: "admin",
      3: "manager",
      4: "worker",
    }

    useEffect(() => {
      fetch(`http://130.49.148.168:8448/links/${address}`)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error(err))
    }, [address])

    useEffect(() => {
      if (isOpen) {
        setBoardName(initialName || "Новая Доска");
        setAbout(initialAbout || "Описание доски");
      }
    }, [isOpen, initialName, initialAbout]);

    if (!isOpen) return null;

    const saveBoardChanges = async () => {
      if (isEdit){
        const boardInfo = {
          board_name: boardName,
          about: about,
        };

        await fetch(`http://130.49.148.168:8448/boards-info/${address}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(boardInfo),
        });

      }
      else {
        createBoard(address,username,boardName,about)
      }

      onClose();
    };

    const keyPress = (e) => {
      if (e.key === 'Escape'){
        onClose();
      }
    };

    const addUser = async (username,role_name) => {
      if (!addUsernameValue.trim()) return;
      const res = await fetch(`http://130.49.148.168:8448/links`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user_name: username, address: address, role_name: role_name})
      });

      const data = await res.json();


      setAddUsernameValue("");
    }

    const addUserBlock = () => {
      return (
        <div className={styles.addUserBlock}>
          <input
            autoFocus
            value={addUsernameValue}
            onChange={(e) => setAddUsernameValue(e.target.value)}
            placeholder="Юзернейм"
            className={styles.input}
          />

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.select}
          >
            <option value="Administrator">Администратор</option>
            <option value="Manager">Менеджер</option>
            <option value="Worker">Сотрудник</option>
          </select>

          <button
            className={styles.button}
            onClick={() => addUser(addUsernameValue, selectedRole)}
          >
            Добавить
          </button>

        </div>
      )
    }

    const usersBlock = () => {
      return (
        <div className={styles.usersBlock}>
          <div className={styles.usersTitle}>Пользователи доски</div>

          {users.length === 0 ? (
            <div className={styles.emptyUsers}>Нет пользователей</div>
          ) : (
            users.map((user) => (
              <div key={user.user_id} className={styles.userRow}>
                <span className={styles.username}>
                  {user.username}
                </span>

                <span
                  className={`${styles.role} ${
                    styles[roleClassMap[user.role_id]]
                  }`}
                >
                  {roleNamesRu[user.role_id] ?? user.role_id}
                </span>
              </div>
            ))
          )}
        </div>
      )
    }
    
    return (
      <div className={styles.overlayEditBoard} onClick={onClose} onKeyDown={(e) => keyPress(e)}>
        <div
          className={styles.editBoard}
          onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
        >
          <h2>Редактирование доски</h2>

          <input
            autoFocus
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Название"
            maxLength={40}
          />

          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Описание"
            maxLength={200}
          />

          {isEdit && addUserBlock()}

          {isEdit && usersBlock()}

          <button onClick={saveBoardChanges} className={styles.saveBoardChanges}>
            {isEdit ? "Сохранить изменения" : "Создать доску"}
          </button>
        </div>
      </div>
    );
  };

  const boardList = () => {
    return (
      <>
        <ul className={styles.boardlist}>
          {boards.map(board => (
            <li key={board.board_id}>
              <span onClick={() => openBoard(board.address)}>
                {board.board_name}
              </span>

              <button
                onClick={() => {
                  setSelectedBoard(board);
                  setIsEdit(true);
                  setIsOpen(true);
                }}
              >
                Редактировать
              </button>
            </li>
          ))}
        </ul>

        {isOpen && selectedBoard && (
          <Modal
            isOpen={isOpen}
            address={selectedBoard.address}
            initialName={selectedBoard.board_name}
            initialAbout={selectedBoard.about}
            onClose={() => {setIsEdit(true);setIsOpen(false)}}
            isEdit={isEdit}
          />
        )}
      </>
    );
  };

  

  return (
    <div className={styles.container}>
      <h2> Мои доски:</h2>
      <div className={styles.boardlistContainer}>
        {boardList()}
      </div>
      <button
        onClick={() => {
        setSelectedBoard({board_name: "Новая доска", address: nanoid(10), about: "Описание доски"});
        setIsEdit(false);
        setIsOpen(true);
      }}>
        Создать доску
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // теперь layout — это родительский route
    children: [
      {
        index: true,
        loader: async () => {
          const token = localStorage.getItem("token");

          if (!token) {
            throw redirect("/register");
          }

          const user = await fetch("http://130.49.148.168:8448/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })

          const username = user.user_name;
          const res = await fetch(`http://130.49.148.168:8448/user-boards/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Response("Ошибка загрузки досок", { status: res.status });
          }

          return res.json();
        },
        element: <Home />,
      },
      {
        path: "board/:address",
        loader: async ({ params }) => {
          const token = localStorage.getItem("token");

          const res = await fetch(`http://130.49.148.168:8448/boards/${params.address}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw redirect("/");
          }

          return null;
        },
        element: <Board />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "temp",
        element: <Boardslist />,
      },
    ],
  },
]);

export default function App() {
  return(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}