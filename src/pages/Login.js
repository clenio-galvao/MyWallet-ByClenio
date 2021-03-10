// Foi utilizado o arquivo igual ao feito em aula pelo ícaro. Contudo, totalmente compreendido e com algumas modificações
import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropsType from 'prop-types';
import { AuthContext } from '../auth/AuthContext';
import { login as loginAction } from '../actions';
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
    return <Redirect to="/wallet" />;
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
        <div className="formField__error">
          { errors.userEmail}
        </div>
      );
    }
  }

  const passwordError = () => {
    const { errors } = state;
    if (errors.userPassword) {
      return (
        <div className="formField__error">
          { errors.userPassword }
        </div>
      );
    }
  }

  const emailRender = () => {
    return (
      <div className="input-group form-group d-flex flex-column">
        <div className="d-flex flex-row">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-user"></i></span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="username"
            name="email"
            onChange={ validateImput }
            data-testid="email-input"
          />
        </div>
        { emailError() }
      </div>
    );
  }

  const passwordRender = () => {
    return (
      <div className="input-group form-group">
        <div className="input-group-prepend">
          <span className="input-group-text"><i className="fas fa-key"></i></span>
        </div>
        <input
          type="password"
          className="form-control"
          placeholder="password"
          name="password"
          onChange={ validateImput }
          data-testid="password-input"
        />
        { passwordError() }
      </div>
    );
  }
  const { email, password, habilitaBotao } = state;
  const { login, history } = props;
  return (
    <div className="login">
      <div className="d-flex justify-content-center w-100 h-100">
        <div className="Login card">
          <div className="card-header"><h3>Sign In</h3></div>
          <div className="card-body">
            <form>
              { emailRender() }
              { passwordRender() }
              <div className="button">
                <button
                  type="button"
                  disabled={ habilitaBotao }
                  className="btn float-right login_btn"
                  onClick={ () => {
                    login({ email, password, history });
                  } }
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer">
            <div class="d-flex justify-content-center links">
              Não tem conta?
              <Link to="/cadastro">
                <p>Cadatre-se</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  login: PropsType.func.isRequired,
  history: PropsType.objectOf.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  login: (e) => dispatch(loginAction(e)),
});

export default connect(null, mapDispatchToProps)(Login);
