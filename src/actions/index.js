import { authConfig } from '../auth/config';

const getCurrencies = (value) => ({ type: 'GET_CURRENCIES', value });
export const loginUser = (value) => ({ type: 'LOGIN_EXIST_USER', value });

export const login = (value) => {
  return async () => {
    const { email, password, history } = value;
    try {
      await authConfig
        .auth()
        .signInWithEmailAndPassword(email, password)
        .onAuthStateChanged((user) => {
          return ({ type: 'LOGIN', value: user });
        });
      history.push('/');
    } catch (error) {
      console.log(error);
      alert('Alguma coisa deu errado! Verifique sua senha e email ou se tem cadastro realmente!!');
    }
  }
}

export const cadastro = (value) => {
  return async () => {
    const { email, password, history } = value;
    try {
      await authConfig
        .auth()
        .createUserWithEmailAndPassword(email, password);
      history.push('/');
      return ({ type: 'LOGIN', value });
    } catch (error) {
      console.log(error);
      alert('Alguma coisa deu errado!');
    }
  }
}

export function fetchCurrencies() {
  return async (dispatch) => {
    try {
      const currenciesResponse = await fetch('https://economia.awesomeapi.com.br/json/all');
      const currenciesJason = await currenciesResponse.json();

      return dispatch(getCurrencies(currenciesJason));
    } catch (error) {
      console.log(error);
    }
  };
}
