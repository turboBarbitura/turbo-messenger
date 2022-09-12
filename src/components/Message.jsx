import React, {useContext, useEffect, useRef} from 'react';
import {AuthContext} from "../context/AuthContext";
import {ChatContext} from "../context/ChatContext";

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const ref = useRef()

  //Каждый раз когда получаем сообщение, будет плавная прокрутка.
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:'smooth'})
  },[message])

  console.log('Это сообщение ', message)
  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}/>
        <span>Только что</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt=""/>}
      </div>
    </div>
  );
};

export default Message;