// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
const initialState = {
  currencies: [],
  isFetching: true,
};

function wallet(state = initialState, action) {
  switch (action.type) {
  case 'GET_CURRENCIES':
  {
    const currenciesArray = Object.keys(action.value);
    let indice = currenciesArray.indexOf('USDT');
    while (indice >= 0) {
      currenciesArray.splice(indice, 1);
      indice = currenciesArray.indexOf('USDT');
    }
    return { ...state, currencies: currenciesArray, isFetching: false };
  }
  default:
    return state;
  }
}

export default wallet;
