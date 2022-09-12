import React, {useState} from 'react';
import AddAvatar from '../img/addAvatar.png'
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth, db, storage} from "../firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {doc, setDoc} from "firebase/firestore";
import {NavLink, useNavigate} from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()

  //Состояние для ошибок.
  const [err, setErr] = useState(false)



  //Делаем функцию ассинхронной!
  const handleSubmit = async (e) => {
    //Превент дэфолт прерывает действия браузера по умолчанию. Здесь оно не будет перезагружать страницу.
    e.preventDefault()

    //Создаём переменные для каждого велью из каждого поля.
    //Таргет с индексом ноль - значит первое поле в форме.
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    //Так как файлов можно выбрать много, чтоб отправлял только первый на сабмите.
    const file = e.target[3].files[0]

    try {
      //Помещаем ответ в переменную res и ожидаем когда он придёт.
      const res = await createUserWithEmailAndPassword(auth, email, password)

      //Создаем путь к загрузке аватара в storage и имя изображения аватара(будет равно имени пользователя)
      const avatarUrlRef = ref(storage, `avatars/${displayName}`);


      const uploadTask = uploadBytesResumable(avatarUrlRef, file);


      uploadTask.on(
        (err) => {
          setErr(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            })
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            })

            await setDoc(doc(db, 'userChats', res.user.uid),{
            })
            navigate('/')
          });

        }
      );

    } catch (err) {
      //Если будет ошибка, состояние поменяется на true и пользователю выведется условная отрисовка.
      //Что-то пошло не так... Под кнопкой регистрации.
      setErr(true)
    }


  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>турбоЧатик</span>
        <span className='title'>Регистрация</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Имя'/>
          <input type="email" placeholder='Электронная почта'/>
          <input type="password" placeholder='Пароль'/>
          {/*Инлайн стиль с display:none позволяет скрыть стандартный
             интерфейс инпута с типом файл. А лейбл привязанный к нему
             по айдишнику позволяет задать на его место что угодно. И
             это что угодно будет кликабельным*/}
          <input style={{display: "none"}} type="file" id="file"/>
          <label htmlFor="file">
            <img src={AddAvatar} alt="" style={{height: '35px'}}/>
            <span>Добавить фото профиля</span>
          </label>
          <button>Зарегистрироваться</button>
          {err && <span style={{color:'red', margin:'auto'}}>Что-то пошло не так...</span>}
        </form>
        <p>У вас уже есть аккаунт? <NavLink to='/login'>Войти.</NavLink> </p>
      </div>

    </div>
  );
};

export default Register;