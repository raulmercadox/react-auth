import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const emailRef = useRef();
  const passwordRef = useRef();

  const authUserHandler = event => {
    event.preventDefault();
    setIsLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let url = '';
    if (isLogin)
    {
      // Login
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBjs1a6JZJRi0coZ6NhFaGKklQ-eVXYIMM';
    }
    else
    {
      // Create user
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBjs1a6JZJRi0coZ6NhFaGKklQ-eVXYIMM';
    }
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    }).then(response => {
      setIsLoading(false);
      if (response.ok)
      {
        return response.json();
      }
      else
      {
        return response.json().then(data => {
          const errorMessage ='Authentication failed!';
          throw new Error(errorMessage);
        })
      }
    }).then(data => {
      console.log(data);
    }).catch(error => {
      alert(error);
    })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={authUserHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
