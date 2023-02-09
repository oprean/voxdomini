import { Chat } from '@mui/icons-material';
import { Grid, Box} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import ChatBar from '../components/chat/ChatBar';
import ChatBody from '../components/chat/ChatBody';
import ChatFooter from '../components/chat/ChatFooter';
import {useStateValue} from '../utils/state';
import socketIO from 'socket.io-client';
import {SOCKETIO_SERVER_HOST} from '../utils/constants';
//https://www.npmjs.com/package/mui-chat-box

// uncomment next line to connect to socketIO.
//const socket = socketIO.connect(SOCKETIO_SERVER_HOST);
const socket = {}

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [state, dispatch ] = useStateValue();

    useEffect(()=> {
        socket.off("messageResponse").on("messageResponse", data => {
          setMessages([...messages, data])
        })
    }, [socket, messages])
        
  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody messages={messages} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
  
};


export default ChatPage;

