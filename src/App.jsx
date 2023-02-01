import classNames from 'classnames';
import { useState } from 'react';
import { createUser, getUserByEmail } from './api';

export const App = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');

    return userData ? JSON.parse(userData) : null;
  });

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const [needToRegister, setNeedToRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function saveUser(user) {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function register() {
    return createUser({ name, email })
      .then(saveUser)
      .catch(() => {
        setErrorMessage('Can\'t create a user');
      })
  }

  function checkEmail() {
    return getUserByEmail(email)
      .then(existingUser => {
        if (existingUser) {
          saveUser(existingUser);
        } else {
          setNeedToRegister(true);
        }
      })
      .catch(() => {
        setErrorMessage('Can\'t create a user');
      });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true)

    if (needToRegister) {
      await register();
    } else {
      await checkEmail()
    }

    setLoading(false);
  }

  function clear() {
    setUser(null);
    setErrorMessage('');
    setNeedToRegister(false);
    setName('');

    localStorage.removeItem('user');
  }

  if (user) {
    return (
      <section className="section container is-flex is-justify-content-center">
        <div className="box has-text-centered content">
          <p className="subtitle">Your <b>userId</b> is</p>
          <p className="title">{user.id}</p>

          <p>
            Please use it for all your requests to the
            <a href="https://mate-academy.github.io/fe-students-api/"> Students API</a>. For example:
          </p>

          <p className="my-3">
            <code>
              https://mate.academy/students-api/todos?userId={user.id}
            </code>
          </p>
          
          <button className="button" onClick={clear}>
            Clear
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="container is-flex is-justify-content-center	">
      <form onSubmit={handleSubmit} className="box mt-5">
        <h1 className="title is-3">
          {needToRegister ? 'You need to register' : 'Get your userId'}
        </h1>

        <div className="field">
          <label className="label" htmlFor="user-email">
            Email
          </label>

          <div
            className={classNames('control has-icons-left', {
              'is-loading': loading,
            })}
          >
            <input
              type="email"
              id="user-email"
              name="email"
              className={classNames('input', {
                'is-danger': !needToRegister && errorMessage,
              })}
              placeholder="Enter your email"
              disabled={loading || needToRegister}
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />

            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>

          {!needToRegister && errorMessage && (
            <p className="help is-danger">{errorMessage}</p>
          )}
        </div>

        {needToRegister && (
          <div className="field">
            <label className="label" htmlFor="user-name">
              Your Name
            </label>

            <div
              className={classNames('control has-icons-left', {
                'is-loading': loading,
              })}
            >
              <input
                type="text"
                id="user-name"
                name="name"
                className={classNames('input', {
                  'is-danger': needToRegister && errorMessage,
                })}
                placeholder="Enter your name"
                required
                minLength={4}
                disabled={loading}
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </div>

            {needToRegister && errorMessage && (
              <p className="help is-danger">{errorMessage}</p>
            )}
          </div>
        )}

        <div className="field">
          <button
            type="submit"
            className={classNames('button is-primary', {
              'is-loading': loading,
            })}
          >
            {needToRegister ? 'Register' : 'Login'}
          </button>
        </div>
      </form>
    </section>
  );
};
