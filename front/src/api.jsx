import { useState } from 'react';
import {nanoid} from 'nanoid';
import {board_example} from './examples/board-example.js';

export async function createBoard(address, username, boardName = 'New Board', about = 'Board description'){
    const createBoardUrl = 'http://130.49.148.168:8448/boards';

    const data = await fetch(createBoardUrl, {
      method: 'POST',
      credentials: "omit",
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({board: {board_name: boardName, address: address, about: about, contents: board_example}, owner_name: username})
    })

    return data.json(); //{"board_id": board_id, "owner_id": owner_id, "address": address}
}

export async function checkBoardAccess(address,username){
    const boardAccessUrl = `http://130.49.148.168:8448/boards/${address}/${username}`;

    

}