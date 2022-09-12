import React, {useContext, useEffect, useState} from 'react';
import AddImage from '../img/addImage.png'
import AttachFile from '../img/attachFile.png'
import {AuthContext} from "../context/AuthContext";
import {ChatContext} from "../context/ChatContext";
import {doc, updateDoc, arrayUnion, Timestamp, serverTimestamp} from "firebase/firestore";
import {db, storage} from "../firebase";
import {v4 as uuid} from 'uuid'
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";

const Input = () => {

  const [text, setText] = useState('')
  const [img, setImg] = useState()

  const {data} = useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)


  console.log('Это дата', data)
  console.log('Это текущий пользователь', currentUser)

  const handleSend = async () => {
    if(img){

      //Создаем путь к загрузке медиа в storage.
      const storageMediaImagesRef = ref(storage, `media/images/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageMediaImagesRef, img);

      uploadTask.on(
        (err) => {
          // setErr(true)
          console.log(err)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            })
          });

        }
      );


    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      })
    }

    console.log('Это картинка', img)
    console.log('Это текст', text)


    //Обновление чата для текущего пользователя
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
    [data.chatId+'.lastMessage']:{
      text
    },
    [data.chatId+'.date']: serverTimestamp()
    })

    //Обновление чата для пользователя, с которым идет диалог.
    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId+'.lastMessage']:{
        text
      },
      [data.chatId+'.date']: serverTimestamp()
    })


    setText('')
    setImg(null)
  }

  return (
    <div className='input'>
      <input type="text" placeholder='Сообщение...' value={text} onChange={e=>setText(e.target.value)}/>
      <div className="send">
        <img src={AttachFile} alt="" style={{height:'24px'}}/>
        <input type="file" style={{display:'none'}} id='file' onChange={e=>setImg(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={AddImage} alt="" style={{height:'28px', marginTop:'6px'}}/>
        </label>
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
};

export default Input;