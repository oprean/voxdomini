import React, { useState } from 'react';
import {useStateValue} from '../../utils/state';
import {DATE_FORMAT} from '../../utils/constants';
import moment from 'moment';

const ChatFooter = ({socket}) => {
  const [message, setMessage] = useState('');
  const [state, dispatch ] = useStateValue();
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && state.user.nickname) {
      socket.emit('message', {
        text: message,
        name: state.user.nickname,
        id: `${socket.id}${Math.random()}`,
        time:moment().format(DATE_FORMAT),
        socketID: socket.id,
      });
    }
    setMessage('');
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;