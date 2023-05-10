import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import {useStateValue} from '../../utils/state';

const ChatBar = ({socket}) => {
  const [state, dispatch ] = useStateValue();
  const [users, setUsers] = useState([]);

  function handleEnterChat() {
    socket.emit('newUser', { userName:state.user.nickname, socketID: socket.id });
  }

  const handleLeaveChat = () => {
      window.location.reload()
  }

  useEffect(() => {
    socket.on('newUserResponse', (data) => {
      setUsers(data)
    });
  }, [socket, users]);

  return (
    <div className="chat__sidebar">
      <div>
        <Button size="small" variant="outlined" onClick={handleEnterChat}>Enter</Button>
        <Button size="small" variant="outlined" onClick={handleLeaveChat}>Leave</Button>
      </div>
     <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
        {users.map((user) => (
            <p key={user.socketID}>{user.userName}</p>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;