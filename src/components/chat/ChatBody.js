import React from 'react';
import {useStateValue} from '../../utils/state';

const ChatBody = ({ messages }) => {
    const [state, dispatch ] = useStateValue();
  return (
    <>
      {/*This shows messages sent from you*/}
      <div className="message__container">
      {messages.map((message) =>
            message.name === state.user.nickname ? (
          <div className="message__chats" key={message.id}>
            <p className="sender__name">You ({message.time})</p>
            <div className="message__sender">
            <p>{message.text}</p>
            </div>
        </div>
        ) : (
    <div className="message__chats" key={message.id}>
        <p>{message.name} ({message.time}!)</p>
        <div className="message__recipient">
          <p>{message.text}</p>
        </div>
    </div>
    )
    )}

        {/*This is triggered when a user is typing*/}
        {1==2 && <div className="message__status">
          <p>Someone is typing...</p>
        </div>}
      </div>
    </>
  );
};

export default ChatBody;