import { authConfig } from '../auth/config';

const getCurrencies = (value) => ({ type: 'GET_CURRENCIES', value });

export const login = (value) => {
  return async () => {
    const { email, password, history } = value;
    try {
      await authConfig
        .auth()
        .signInWithEmailAndPassword(email, password);
      history.push('/wallet');
    } catch (error) {
      console.log(error);
    }
  }
}

export const logout = () => {
  return async () => {
    try {
      await authConfig.auth().signOut();
    } catch (error) {
      console.log(error);
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
      history.push('/wallet');
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
