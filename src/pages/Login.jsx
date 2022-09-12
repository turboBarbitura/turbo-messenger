import React, {useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";

import {auth} from "../firebase";
import {signInWithEmailAndPassword} from "firebase/auth"

const Login = () => {

  const navigate = useNavigate()

  //Состояние для ошибок.
  const [err, setErr] = useState(false)


  //Делаем функцию ассинхронной!
  const handleSubmit = async (e) => {
    //Превент дэфолт прерывает действия браузера по умолчанию. Здесь оно не будет перезагружать страницу.
    e.preventDefault()

    //Создаём переменные для каждого велью из каждого поля.
    //Таргет с индексом ноль - значит первое поле в форме.
    const email = e.target[0].value
    const password = e.target[1].value

    try {
     await signInWithEmailAndPassword(auth, email, password)
          //Если пользователь найден, перекинет на главную страницу.
          navigate('/')
    }
    catch (err) {
      //Если будет ошибка, состояние поменяется на true и пользователю выведется условная отрисовка.
      //Что-то пошло не так... Под кнопкой регистрации.
      setErr(true)
    }
  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>турбоЧатик</span>
        <span className='title'>Вход</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder='Адрес электронной почты'/>
          <input type="password" placeholder='Пароль'/>
          <button>Войти</button>
          {err && <span style={{color:'red', margin:'auto'}}>Что-то пошло не так...</span>}

          <p>У вас еще нет аккаунта? <NavLink to='/register'>Регистрация.</NavLink> </p>
        </form>
      </div>

    </div>
  );
};

export default Login;