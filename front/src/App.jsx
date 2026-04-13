import { useState } from "react";
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
  const boardList = () => {
    return(
      <ul className={styles.boardlist}>
        {boards.map(board => (
          <li key={board.board_id} onClick={() => openBoard(board.address)}>
              {board.board_name}
          </li>
        ))}
      </ul>
    )
  }

  

  return (
    <div className={styles.container}>
      <h2> Мои доски:</h2>
      <div className={styles.boardlistContainer}>
        {boardList()}
      </div>
      <button onClick={() => createBoard(nanoid(10),user.user_name)}>Создать доску</button>
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
          console.log(params.address);

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
      <RouterProvider router={router} />;
    </AuthProvider>
  )
}