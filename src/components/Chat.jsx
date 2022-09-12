import React, {useContext} from 'react';
import Cam from '../img/cam.png'
import Add from '../img/addUser.png'
import More from '../img/more.png'
import Messages from "./Messages";
import Input from "./Input";
import {ChatContext} from "../context/ChatContext";

const Chat = () => {

  const {data} = useContext(ChatContext)

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data?.user.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" style={{height:'30px', filter:'invert(100%)'}}/>
          <img src={Add} alt="" style={{height:'25px', filter:'invert(100%)'}}/>
          <img src={More} alt="" style={{height:'25px', filter:'invert(100%)'}}/>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  );
};

export default Chat;