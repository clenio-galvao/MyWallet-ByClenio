import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropsType from 'prop-types';
import { AuthContext } from '../auth/AuthContext';
import { cadastro as cadastroAction } from '../actions';
import { Link, Redirect } from 'react-router-dom';

function Cadastro(props) {
  const initialEstado = {
    email: '',
    password: '',
    passwordRepet: '',
    errors: { userEmail: '', userPassword: '', userPasswordRepet: '' },
    desabilitaBotao: true,
  };
  const [estado, setEstado] = useState(initialEstado);

  const { user } = useContext(AuthContext);
  if (user) {
    return <Redirect to="/" />;
  }

  const validateEmail = (values) => {
    const { errors } = estado;
    const reg = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    if (!reg.test(values)) {
      setEstado({ ...estado, errors: { ...errors, userEmail: 'Insira um e-mail válido' } });
    } else {
      setEstado({ ...estado, email: values, errors: { ...errors, userEmail: '' } });
    }
  }

  const validatePassword = (values) => {
    const { errors } = estado;
    const NUMERO_DE_CARACTERES = 6;
    if (values.length < NUMERO_DE_CARACTERES) {
      setEstado({
        ...estado,
        errors:
          { ...errors, userPassword: 'Insira uma senha com pelo menos 6 caracteres' },
      });
    } else {
      setEstado({ ...estado, password: values, errors: { ...errors, userPassword: '' } });
    }
  }

  const validatePasswordRepet = (values) => {
    const { password, errors } = estado;
    console.log(`${password} sou password`)
    console.log(`${values} sou repet password`)

    if (password !== values) {
      setEstado({
        ...estado,
        errors:
          { ...errors, userPasswordRepet: 'Senhas diferentes' },
      });
    } else {
      setEstado({ ...estado, passwordRepet: values, errors: { ...errors, userPasswordRepet: '' }, desabilitaBotao: false });
    }
  }

  const emailError = () => {
    const { errors } = estado;
    if (errors.userEmail) {
      return (
        <span className="formField__error">
          { errors.userEmail}
        </span>
      );
    }
  }

  const passwordError = () => {
    const { errors } = estado;
    if (errors.userPassword) {
      return (
        <span className="formField__error">
          { errors.userPassword}
        </span>
      );
    }
  }
  
  const passwordRepetError = () => {
    const { errors } = estado;
    if (errors.userPasswordRepet) {
      return (
        <span className="formField__error">
          { errors.userPasswordRepet}
        </span>
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
            onChange={(e) => {
              validateEmail(e.target.value);
            }}
            placeholder="username"
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
        <div className="input-group form-group">
          <div className="input-group-prepend">
            <span className="input-group-text"><i className="fas fa-key"></i></span>
          </div>
          <input
            type="password"
            className="form-control"
            onChange={ (e) => {
              validatePassword(e.target.value);
            } }
            placeholder="senha"
            data-testid="password-input"
          />
        </div>
        { passwordError() }
      </div>
    );
  }

  const passwordRepetRender = () => {
    return (
      <div>
        <div className="input-group form-group">
          <div className="input-group-prepend">
            <span className="input-group-text"><i className="fas fa-key"></i></span>
          </div>
          <input
            type="password"
            className="form-control"
            onChange={ (e) => {
              validatePasswordRepet(e.target.value);
            } }
            placeholder="repita a senha"
            data-testid="password-input"
          />
        </div>
        { passwordRepetError() }
      </div>
    );
  }
  const { email, password, desabilitaBotao } = estado;
  const { cadastro, history } = props;
  return (
    <div className="cadastro">
      <div className="d-flex justify-content-center w-100 h-100">
        <div className="card">
          <div className="card-header"><h3>Sign Up</h3></div>
          <div className="card-body">
            <form>
              { emailRender() }
              { passwordRender() }
              { passwordRepetRender() }
              <div className="button">
                <button
                  type="button"
                  disabled={ desabilitaBotao }
                  className="btn float-right login_btn"
                  onClick={ () => {
                    cadastro({ email, password, history });
                  } }
                >
                  Cadastro
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer">
            <div class="d-flex justify-content-center links">
              Lembrou que tem conta?
              <Link to="/login">
                <p>Login</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Cadastro.propTypes = {
  cadastro: PropsType.func.isRequired,
  history: PropsType.objectOf.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  cadastro: (e) => dispatch(cadastroAction(e)),
});

export default connect(null, mapDispatchToProps)(Cadastro);