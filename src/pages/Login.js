// Foi utilizado o arquivo igual ao feito em aula pelo ícaro. Contudo, totalmente compreendido e com algumas modificações
import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropsType from 'prop-types';
import { AuthContext } from '../auth/AuthContext';
import { login as loginAction, loginUser as loginUserAction } from '../actions';
import { Link, Redirect } from 'react-router-dom';

function Login(props) {
  const initialState = {
    email: '',
    password: '',
    errors: { userEmail: '', userPassword: '' },
    habilitaBotao: true,
  };
  const [state, setState] = useState(initialState);

  const { user } = useContext(AuthContext);
  if (user) {
    const { loginUser } = props;
    loginUser(user);
    return <Redirect to="/" />;
  }

  const validateImput = (e) => {
    const {name, value} = e.target;
    const { errors } = state;
    if (name === 'email') {
      const reg = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
      if (!reg.test(value)) {
        setState({ ...state, errors: { ...errors, userEmail: 'Insira um e-mail válido' } });
      } else {
        setState({ ...state, [name]: value, errors: { ...errors, userEmail: '' } });
      }
    }
    if (name === 'password') {
      const NUMERO_DE_CARACTERES = 6;
      if (value.length < NUMERO_DE_CARACTERES) {
        setState({
          ...state,
          errors:
            { ...errors, userPassword: 'Insira uma senha com pelo menos 6 caracteres' },
        });
      } else {
        setState({ ...state, [name]: value, errors: { ...errors, userPassword: '' }, habilitaBotao: false });
      }
    }
  }

  const emailError = () => {
    const { errors } = state;
    if (errors.userEmail) {
      return (
        <span className="formField__error">
          { errors.userEmail}
        </span>
      );
    }
  }

  const passwordError = () => {
    const { errors } = state;
    if (errors.userPassword) {
      return (
        <span className="formField__error">
          { errors.userPassword}
        </span>
      );
    }
  }

  const emailRender = () => {
    return (
      <div>
        <div className="formField">
          <input
            type="text"
            name="email"
            onChange={ validateImput }
            placeholder="email"
            data-testid="email-input"
          />
        </div>
        { emailError()}
      </div>
    );
  }

  const passwordRender = () => {
    return (
      <div>
        <div className="formField">
          <input
            type="password"
            name="password"
            onChange={ validateImput }
            placeholder="senha"
            data-testid="password-input"
          />
        </div>
        { passwordError() }
      </div>
    );
  }
  const { email, password, habilitaBotao } = state;
  const { login, history } = props;
  return (
    <div className="Login">
      <section className="login-inputs">
        <>Login</>
        { emailRender() }
        { passwordRender() }
      </section>
      <div className="button">
        <button
          type="button"
          disabled={ habilitaBotao }
          onClick={ () => {
            login({ email, password, history });
          } }
        >
          Entrar
        </button>
        <Link to="/cadastro">
          <p>Cadatre-se</p>
        </Link>
      </div>
    </div>
  );
}

Login.propTypes = {
  login: PropsType.func.isRequired,
  history: PropsType.objectOf.isRequired,
  loginUser: PropsType.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  login: (e) => dispatch(loginAction(e)),
  loginUser: (user) => dispatch(loginUserAction(user)),
});

export default connect(null, mapDispatchToProps)(Login);
