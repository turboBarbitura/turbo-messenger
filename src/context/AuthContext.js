import {createContext, useEffect, useState} from "react";
import {auth} from "../firebase";
import { onAuthStateChanged } from 'firebase/auth'

//Создаем контекст зарегестрированного пользователя.
export const AuthContext = createContext()

//Создаём компонент нашего провайдера.
export const AuthContextProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    //Делаем запрос к firebase посредством метода из её библиотеке, которая возвращает залогиненого пользователя.
    const unsub = onAuthStateChanged(auth, (user)=>{
      setCurrentUser(user)
      console.log(user)
    })

    //Отписываемся от обновлений(почитать подробно у Ламы)
    return () => {
      unsub()
    }
  }, []);

  //Провайдер возврашает компонент, внутри которого все дети будут иметь доступ к его контексту.
  return (
  <AuthContext.Provider value={{currentUser}} >
    {children}
  </AuthContext.Provider>
  )
}