import styles from "../styles/Board.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; //для использования данных, полученных при переходе через navigate
import {nanoid} from "nanoid";
import { useAuth } from "../AuthContext.jsx";
import Templates from "./Templates.jsx";
import Connections from "./Connections.jsx";

import trashbold from '../assets/trash-bold.svg';
import trashregular from '../assets/trash-regular.svg';
import plus from '../assets/plus.svg';
import add from '../assets/add.svg';
import taskbuttondone from '../assets/task-button-done.svg';
import taskbutton from '../assets/task-button.svg';
import changeapply from '../assets/change-apply.svg';

export default function Board() {
  const { user } = useAuth();
  const username = user.user_name;

  const [boardData,setBoardData] = useState({columns: []});
  const [boardInfo, setBoardInfo] = useState({board_name: "Название доски", about: "Описание доски"})

  const { address } = useParams();

  useEffect(() => {
    fetch(`http://130.49.148.168:8448/board/${address}`)
      .then(res => res.json())
      .then(data => {setBoardData(data)}); 
  }, [address]);

  useEffect(() => {
    fetch(`http://130.49.148.168:8448/board-info/${address}`)
      .then(res => res.json())
      .then(data => {setBoardInfo(data)}); 
  }, [address]);

  const [updateBoardName, setUpdateBoardName] = useState({board_name: boardInfo.board_name, active: false});

  const [newColumnName, setNewColumnName] = useState("Новая колонка");
  const [updateActiveColumn, setUpdateActiveColumn] = useState({colId: null, title: ""});

  const [activeCard, setActiveCard] = useState({colId: null, title: ""})
  const [updateActiveCard, setUpdateActiveCard] = useState({colId: null, cardId: null, title: ""});

  const [activeTask, setActiveTask] = useState({colId: null, cardId: null, title: ""})
  const [updateActiveTask, setUpdateActiveTask] = useState({colId: null, cardId: null, taskId: null, title: ""})

  //добавление
  const addColumn = () => {
    if (!newColumnName.trim()) return;
    setBoardData(prev => {
      const newBoard = {...prev};
      newBoard.columns = [...newBoard.columns, {id: nanoid(),title: newColumnName, cards: []}];
      return newBoard;});

    setNewColumnName("Новая колонка");{/*хардкод, убрать*/}
  };

  const addCard = (colId) => {
    if (!activeCard.title.trim()) return;
    setBoardData(prev => {
      const newBoard = {...prev,
      columns: prev.columns.map(col => col.id === colId 
        ? {...col, cards: [...col.cards, {id: nanoid(), title: activeCard.title, tasks: []}]}
        : col)};

      return newBoard;})

    setActiveCard({colId: null, title: ""})
  };
  
  const addTask = (colId, cardId) => {
    if (!activeTask.title.trim()) return;
    setBoardData(prev => {
      const newBoard = {
        ...prev,
        columns: prev.columns.map(col => col.id === colId
          ? {...col, 
            cards: col.cards.map(card => card.id === cardId 
              ? {...card, tasks: [...card.tasks, {id: nanoid(), text: activeTask.title, done: false}]}
              : card)}
          : col)}
      return newBoard;
    })

    setActiveTask({colId: null, cardId: null, title: ""})
  };


  //удаление
  const removeColumn = (colId) => {
    setBoardData(prev => {
      const newBoard = {
        ...prev,
        columns: prev.columns.filter(column => column.id !== colId)
      };
      return newBoard;
    })
  };

  const removeCard = (colId,cardId) => {
    setBoardData(prev => {
      const newBoard = {
        ...prev,
        columns: prev.columns.map(col => col.id === colId
          ? {...col, cards: col.cards.filter(card => card.id !== cardId)}
          : col)
      }
      return newBoard;})
  };

  //другое
  //изменение названий
  const updateBoardInfo = () => {
    const title = updateBoardName.board_name;
    if(!title.trim()){
      setUpdateBoardName(prev => ({...prev, active: false}));
      return
    }
    else{
    setUpdateBoardName(prev => ({...prev, active: false}));
    setBoardInfo(prev => ({...prev,board_name: title}));
    }
  }

  const updateColumnTitle = () => {
    const colId = updateActiveColumn.colId;
    const title = updateActiveColumn.title;
    if(!title.trim()){
      setUpdateActiveColumn({colId: null, title: ""});
      return;
    }
    setBoardData(prev => ({
      ...prev,
      columns: prev.columns.map(column => 
        column.id === colId
          ? {...column, title: title}
          : column
        )}
      ))
      setUpdateActiveColumn({colId: null, title: ""})
  };

  const updateCardTitle = () => {
    const colId = updateActiveCard.colId;
    const cardId = updateActiveCard.cardId
    const title = updateActiveCard.title;
    if(!title.trim()){
      setUpdateActiveCard({colId: null, cardId: null, title: ""});
      return;
    }
    setBoardData(prev => ({
      ...prev,
      columns: prev.columns.map(column =>
        column.id === colId
          ? {
              ...column,
              cards: column.cards.map(card =>
                card.id === cardId
                  ? { ...card, title: title }
                  : card
              )
            }
          : column
      )
    }));
    setUpdateActiveCard({colId: null, cardId: null, title: ""})
  };

  const toggleTask = (colId, cardId, taskId) => {
    setBoardData(prev => {
      const newBoard = {
        ...prev,
        columns: prev.columns.map(col => col.id === colId
          ? {...col, 
            cards: col.cards.map(card => card.id === cardId 
              ? {...card,
                tasks: card.tasks.map(task => task.id === taskId ? {...task, done: !task.done} : task)}
              : card)}
          : col)
      };
      return newBoard;})
  };

  /*так называемый usability*/
  /*клавиатура*/
  const addColumnKeyPress = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      addColumn();
      return;
    }
    if (e.key === 'Escape'){
      /*потом*/
      return;
    }
  };

  const addCardKeyPress = (e, colId) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      addCard(colId);
      return;
    }
    if (e.key === 'Escape'){
      setActiveCard({colId: null, title: ""})
      return;
    }
  };

  const addTaskKeyPress = (e, colId, cardId) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      addTask(colId,cardId);
      return;
    }
    if (e.key === 'Escape'){
      setActiveTask({colId: null, cardId: null, title: ""})
      return;
    }
  };

  const updateBoardKeyPress = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      updateBoardInfo();
      return;
    }
    if (e.key === 'Escape'){
      setUpdateBoardName({board_name: boardInfo.board_name, active: false});
    }
  }

  const updateColumnKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape'){
      e.preventDefault();
      updateColumnTitle()
      return;
    }
  };

  const updateCardKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape'){
      e.preventDefault();
      updateCardTitle()
      return;
    }
  };

  const updateTaskKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape'){
      /*потом*/
      return;
    }
  };
  
  //элементы
  
  const boardName = () => {
    return (
      (updateBoardName.active == true)
        ? (
          <div className={styles.updateBoardName}>
            <input 
              autoFocus
              maxLength={40}
              value={updateBoardName.board_name}
              onChange={(e) => setUpdateBoardName(prev => ({...prev, board_name: e.target.value}))}
              onKeyDown={(e) => updateBoardKeyPress(e)}
              onBlur={() => {
                if (updateBoardName.board_name.trim()){
                  updateBoardInfo();
                }
                else{
                  setUpdateBoardName(prev => ({...prev, active: false}));
                }
              }}
            />
            <button onMouseDown={
                (e) => {
                  e.preventDefault(); 
                  updateBoardInfo();
                }}>
                <img src={changeapply}/></button>
          </div>
        )
        : <h1 onClick={() => {setUpdateBoardName({board_name: boardInfo.board_name, active: true})}}>{boardInfo.board_name}</h1>
    )
  }

  const columnTitle = (col) => {
    return (
      (updateActiveColumn.colId == col.id) 
        ? (
          <div className={styles.updateColumnName}>
            <input
              autoFocus
              maxLength={35}
              value={updateActiveColumn.title}
              onChange={(e) => setUpdateActiveColumn(prev => ({...prev, title: e.target.value}))}
              onKeyDown={(e) => updateColumnKeyPress(e)} 
              onBlur={() => {
                if (updateActiveColumn.title.trim()){
                  updateColumnTitle()
                }
                else{
                  setUpdateActiveColumn({colId: null, title: ""})
                }
              }}
            />
            <button onMouseDown={
              (e) => {
                e.preventDefault(); 
                updateColumnTitle();
              }}>
              <img src={changeapply}/></button>
            </div>
          )
        : <h2 onClick={() => {setUpdateActiveColumn({colId: col.id, title: col.title})}}>{col.title}</h2>
      )
  }

  const cardTitle = (col, card) => {
    return (
      (updateActiveCard.colId == col.id) && (updateActiveCard.cardId == card.id) 
        ? (
          <div className={styles.updateCardName}>
            <input
              autoFocus
              maxLength={80}
              value={updateActiveCard.title}
              onChange={(e) => setUpdateActiveCard(prev => ({...prev, title: e.target.value}))}
              onKeyDown={(e) => updateCardKeyPress(e)} 
              onBlur={() => {
                if (updateActiveCard.title.trim()){
                  updateCardTitle(col.Id, card.id, updateActiveCard.title)
                }
                else{
                  setUpdateActiveCard({colId: null, cardId: null, title: ""})
                }
              }}
            />
            <button className={styles.updateCardName} onMouseDown={
              (e) => {
                e.preventDefault(); 
                updateCardTitle(col.id,card.id,updateActiveCard.title);
              }}>
            <img src={changeapply}/></button>
          </div>
        )
        : <h2 onClick={() => {setUpdateActiveCard({colId: col.id, cardId: card.id, title: card.title})}}>{card.title}</h2>
      )
  }

  const cardAddButton = (col) => {
    return (
      (activeCard.colId === col.id)
        ? (
            <div className={styles.addCardContainer}>
              <input
                autoFocus
                maxLength={50}
                value={activeCard.title}
                onChange={(e) => setActiveCard(prev => ({...prev, title: e.target.value}))}
                onKeyDown={(e) => addCardKeyPress(e,col.id)}
                placeholder="Название карточки"
                onBlur={() => {
                  if (activeCard.title.trim()){
                    addCard(col.id)
                  }
                  else{
                    setActiveCard({colId: null, title: ""})
                  }
                }}
              />
              <button className={styles.addcard} onMouseDown={(e) => {e.preventDefault(); addCard(col.id)}}>Добавить</button>
            </div>
          ) 
          : (
            <button 
              onClick={() => setActiveCard({colId: col.id, title: ""})}>
                <img src={plus}/>
                Карточка
            </button>
          )
      )
  }
    
  const taskList = (col, card) => {
    return (
      <ul className={styles.tasklist}>
        {card.tasks.map(task => (
          <li key={task.id}>
            <button 
              onClick={() => toggleTask(col.id, card.id, task.id)}>
                <img src={task.done ? taskbuttondone : taskbutton}/>
            </button>
            <span 
              className={task.done ? styles.done : ""}
              onClick={() => toggleTask(col.id, card.id, task.id)}>
                {task.text}
            </span>
          </li>
        ))}
      </ul>
    )
  }
 
  const taskAddButton = (colId, cardId) => {
    return (
    (activeTask.colId === colId) && (activeTask.cardId === cardId) ? (
      <div>
        <input
          autoFocus
          maxLength={50}
          value={activeTask.title}
          onChange={(e) => setActiveTask(prev => ({...prev, title: e.target.value}))}
          onKeyDown={(e) => addTaskKeyPress(e,colId,cardId)}
          onBlur={() => {
            if (activeTask.title.trim()){
              addTask(colId,cardId)
            }
            else {
              setActiveTask({colId: null, cardId: null, title: ""})
            }
          }}
          placeholder="Задание"
        />
        <button className={styles.addtask} onMouseDown={(e) => {e.preventDefault(); addTask(colId, cardId)}}>Добавить</button>
      </div>
    ) : (
      <button onClick={() => setActiveTask({ colId: colId, cardId: cardId, title: ""})}>
        <img src={add}/> добавить задание
      </button>
    ))
  }

  return (
    
    <div className={styles.board}>
      <div className={styles.boardname}>
        {boardName()}
        <button className={styles.addcolumn} onClick={async () => {
          await fetch(`http://130.49.148.168:8448/boards/${address}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(boardData),
          });
          await fetch(`http://130.49.148.168:8448/boards-info/${address}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(boardInfo),
          });
          }}>Сохранить</button>
      </div>

      <div className={styles.columns}>
        {boardData.columns.map(col => (
          <div key={col.id} className={styles.column}>
            <div className={styles.columnheader}>
              {columnTitle(col)}
              <button onClick={() => removeColumn(col.id)}><img src={trashbold}/></button>
            </div>
            {col.cards.map(card => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardheader}>
                  {cardTitle(col,card)}
                  <button onClick={() => removeCard(col.id,card.id)}><img src={trashregular}/></button>
                </div>
                  {taskAddButton(col.id,card.id)}
                {taskList(col,card)}
              </div>
            ))}
            {cardAddButton(col)}
          </div>
        ))}
       <button 
        className={styles.addcolumn}
        onClick={() => {addColumn()}}>
          добавить колонку</button>
      </div>

      <Templates />

      <Connections userName={username} boardAddress={address}/>
    </div>
  );
}