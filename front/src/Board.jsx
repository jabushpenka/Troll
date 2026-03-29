import { useState } from "react";
import {nanoid} from "nanoid";
import './Board.css';
import trashbold from './assets/trash-bold.svg';
import trashregular from './assets/trash-regular.svg';
import plus from './assets/plus.svg';
import add from './assets/add.svg';
import taskbuttondone from './assets/task-button-done.svg';
import taskbutton from './assets/task-button.svg';

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [newColumn, setNewColumn] = useState("");

  const [addingCardColId, setAddingCardColId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  const [addingTask, setAddingTask] = useState({ colId: null, cardId: null });
  const [newTaskText, setNewTaskText] = useState("");

  const addColumn = () => {
    if (!newColumn.trim()) return;
    setColumns([...columns, { id: nanoid(), title: newColumn, cards: [] }]);
    setNewColumn("");
  };

  const addCard = (colId) => {
    if (!newCardTitle.trim()) return;
    setColumns(columns.map(col => col.id === colId
      ? { ...col, cards: [...col.cards, { id: nanoid(), title: newCardTitle, tasks: [] }] }
      : col
    ));
    setNewCardTitle("");
    setAddingCardColId(null);
  };

  const updateCardTitle = (colId, cardId, title) => {
    setColumns(columns.map(col => col.id === colId
      ? {
          ...col,
          cards: col.cards.map(card => card.id === cardId ? { ...card, title } : card)
        }
      : col
    ));
  };

  const addTask = (colId, cardId) => {
    if (!newTaskText.trim()) return;
    setColumns(columns.map(col => col.id === colId
      ? {
          ...col,
          cards: col.cards.map(card => card.id === cardId
            ? { ...card, tasks: [...card.tasks, { id: nanoid(), text: newTaskText, done: false }] }
            : card)
        }
      : col
    ));
    setNewTaskText("");
    setAddingTask({ colId: null, cardId: null });
  };

  const toggleTask = (colId, cardId, taskId) => {
    setColumns(columns.map(col => col.id === colId
      ? {
          ...col,
          cards: col.cards.map(card => card.id === cardId
            ? {
                ...card,
                tasks: card.tasks.map(task => task.id === taskId
                  ? { ...task, done: !task.done }
                  : task)
              }
            : card)
        }
      : col
    ));
  };

  const removeColumn = (colId) => {
    setColumns(prev => prev.filter(column => column.id !== colId))
  };

  const removeCard = (colId,cardId) => {
    setColumns(columns.map(col => col.id === colId
      ? {...col, cards: col.cards.filter(card => card.id !== cardId)}
      : col
    ));
  }

  return (
    <div className="board">
      <div className="board-header">
        <input
          placeholder="Новая колонка"
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
        />
        <button className="addcolumn" onClick={addColumn}>Добавить колонку</button>
      </div>

      <div className="columns">
        {columns.map(col => (
          <div key={col.id} className="column">
            <div className="columnheader">
              <h2>{col.title}</h2>
              <button onClick={() => removeColumn(col.id)}><img src={trashbold}/></button>
            </div>
            {addingCardColId === col.id ? (
              <div>
                <input
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="Название карточки"
                />
                <button className="addcard" onClick={() => addCard(col.id)}>Добавить</button>
              </div>
            ) : (
              <button onClick={() => setAddingCardColId(col.id)}><img src={plus}/>Карточка</button>
            )}

            {col.cards.map(card => (
              <div key={card.id} className="card">
                <div className="cardheader">
                  <h3>{card.title}</h3>
                  <button onClick={() => removeCard(col.id,card.id)}><img src={trashregular}/></button>
                </div>
                {(addingTask.colId === col.id) && (addingTask.cardId === card.id) ? (
                  <div>
                    <input
                      autoFocus
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Task"
                    />
                    <button className="addtask" onClick={() => addTask(col.id, card.id)}>Добавить</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingTask({ colId: col.id, cardId: card.id })}>
                    <img src={add}/> добавить задание
                  </button>
                )}

                <ul className="tasklist">
                  {card.tasks.map(task => (
                    <li key={task.id}>
                      <button 
                        onClick={() => toggleTask(col.id, card.id, task.id)}>
                          <img src={task.done ? taskbuttondone : taskbutton}/>
                      </button>
                      <span className={task.done ? "done" : ""}>{task.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
