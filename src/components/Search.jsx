import React, {useContext, useState} from 'react';
import {collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp} from "firebase/firestore";
import {db} from '../firebase'
import {AuthContext} from "../context/AuthContext";

const Search = () => {

  const [userName, setUserName] = useState('')
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)

  const {currentUser} = useContext(AuthContext)

  //Создаём функцию поиска
  const handleSearch = async () => {
    //Делаем запрос на поиск пользователя и сравниваем его displayName с тем, что вбито в запросе.
    const q = query(collection(db, 'users'), where('displayName', '==', userName))

    try {
      //Получаем пользователя из запроса.
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
        console.log('user', user)
      })
    } catch (err) {
        setErr(true)
    }
  }

  const handleKey = e => {
    e.code === 'Enter' && handleSearch()
  }

  const handleSelect = async () => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid+user.uid : user.uid+currentUser.uid
    try {
      const res = await getDoc(doc(db, 'chats', combinedId))
      if(!res.exists()) {

        //Создать чат в коллекции чатов
        await setDoc(doc(db, 'chats', combinedId), {messages:[]})

        //Создание чата пользователя
       await updateDoc(doc(db, 'userChats', currentUser.uid),{
        [combinedId+'.userInfo']: {
           uid: user.uid,
           displayName: user.displayName,
           photoURL: user.photoURL
         },
        [combinedId+".date"]:serverTimestamp()
       })

        await updateDoc(doc(db, 'userChats', user.uid),{
          [combinedId+".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId+".date"]:serverTimestamp()
        })

      }
    } catch (err) {
      setErr(true)
    }


    console.log('user', user)

  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Найти пользователя' onKeyDown={handleKey} onChange={e=>setUserName(e.target.value)}/>
      </div>
      {err && <span>Пользователь не найден</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt=""/>
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  );
};

export default Search;