// Esse reducer será responsável por tratar as informações da pessoa usuária
const initialState = {
  user: {},
};

function user(state = initialState, action) {
  switch (action.type) {
  case 'LOGIN':
    return action.value;
    case 'LOGIN_EXIST_USER':
    return action.value;
  default:
    return state;
  }
}

export default user;
