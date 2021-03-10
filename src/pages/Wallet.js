import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCurrencies as fetchCurrenciesAction } from '../actions';
import Table from './Table';
import { authConfig, firebaseDb} from '../auth/config';
import { AuthContext } from '../auth/AuthContext';
import { loginUser as loginUserAction } from '../actions';

const tags = ['', 'Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
const metPg = ['', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
function Wallet(props) {
  const InitialEstado = {
    value: '',
    currency: 'USD',
    method: '',
    tag: '',
    description: '',
    exchangeRates: {},
  }
  const [estado, setEstado] = useState(InitialEstado);
  const [walletUser, setWalletUser] = useState({});
  let [total, setTotal] = useState(0);
  const [currentId, setCurrentId] = useState('');

  const { user } = useContext(AuthContext);

  function addOrEdit(obj) {
    if (currentId === '') {
      firebaseDb.child(user.uid).push(
        obj,
        (err) => {
          if (err) {
            console.log(err);
            alert('Alguma coisa deu errado!');
          }
        }
      )
    } else {
      firebaseDb.child(`${user.uid}/${currentId}`).set(
        obj,
        (err) => {
          if (err) {
            console.log(err);
            alert('Alguma coisa deu errado!');
          }
        }
      )
      setCurrentId('');
    }
  }

  async function getRates() {
    const currenciesResponse = await fetch('https://economia.awesomeapi.com.br/json/all');
    const currenciesJason = await currenciesResponse.json();
    setEstado({ ...estado, exchangeRates: currenciesJason });
  }

  useEffect(() => {
    const { fetchCurrencies } = props;
    fetchCurrencies();
    getRates();

    if (user) {
      const { loginUser } = props;
      loginUser(user);
    }

    firebaseDb.child(user.uid).on('value', (snapshot) => {
      if(snapshot.val() !== null) {
        setWalletUser({ ...snapshot.val() })
      }
    })
  }, []);

  useEffect(() => {
    let soma = 0;
    Object.keys(walletUser).map((id) => {
      soma += parseFloat(walletUser[id].value)
      * parseFloat(walletUser[id].exchangeRates[walletUser[id].currency].ask);
    });
    setTotal(soma)
  }, [walletUser]);

  function edit(id) {
    setEstado({ ...walletUser[id] });
    setCurrentId(id);
  }

  function deleteExpense(id) {
    firebaseDb.child(`${user.uid}/${id}`).remove(
      (err) => {
        if (err) {
          console.log(err);
          alert('Alguma coisa deu errado!');
        }
      }
    )
    setCurrentId('');
  }

  function header() {
    return (
      <header>
        <div>TrybeWallet</div>
        <span data-testid="total-field">{ total.toFixed(2) }</span>
        <span data-testid="header-currency-field">BRL</span>
      </header>
    );
  }

  function valueInput() {
    const { value } = estado;
    return (
      <label htmlFor="value-input">
        Valor:
        <input
          value={ value }
          onChange={ (e) => setEstado({ ...estado, value: e.target.value }) }
          name="value-input"
          type="number"
          data-testid="value-input"
        />
      </label>
    );
  }

  function descEMoedaInput() {
    const { currencies } = props;
    const { description, currency } = estado;
    return (
      <>
        <label htmlFor="description-input">
          Com o que foi gasto?:
          <input
            name="description-input"
            type="text"
            data-testid="description-input"
            value={ description }
            onChange={ (e) => setEstado({ ...estado, description: e.target.value }) }
          />
        </label>
        Moeda:
        <select
          value={ currency }
          onChange={ (e) => setEstado({ ...estado, currency: e.target.value }) }
          data-testid="currency-input"
        >
          { currencies.map((moeda, index) => (
            <option key={ index } value={ moeda } data-testid={ moeda }>
              { moeda }
            </option>))}
        </select>
      </>
    );
  }

  function handleClick(e) {
    e.preventDefault();

    addOrEdit(estado);

    setEstado({
      ...estado,
      value: '',
      currency: 'USD',
      method: '',
      tag: '',
      description: '',
    });
  }

  function forms() {
    const { isFetching } = props;
    const { method, tag } = estado;
    return (
      isFetching ? <p> loading </p>
        : (
          <section>
            <form onSubmit={ handleClick }>
              { valueInput() }
              { descEMoedaInput() }
              Método de pagamento:
              <select
                data-testid="method-input"
                value={ method }
                onChange={ (e) => setEstado({ ...estado, method: e.target.value }) }
              >
                {metPg.map((mpg, ind) => (
                  <option key={ ind } value={ mpg }>
                    { mpg }
                  </option>))}
              </select>
              Categoria (tag):
              <select
                data-testid="tag-input"
                value={ tag }
                onChange={ (e) => setEstado({ ...estado, tag: e.target.value }) }
              >
                {tags.map((categ, ind) => (
                  <option key={ ind } value={ categ }>
                    { categ }
                  </option>))}
              </select>
              <button type="submit">
                { !currentId ? 'Adicionar despesa' : 'Modificar despesa'}
              </button>
            </form>
          </section>
        )
    );
  }

  return (
    <body>
      <button type="button" onClick={() => authConfig.auth().signOut()}>Sair</button>
      { header() }
      { forms() }
      <Table
        deleteExpense={ deleteExpense }
        expenses={ walletUser }
        edit={ edit }
      />
    </body>
  );
}

Wallet.propTypes = {
  email: PropTypes.func.isRequired,
  currencies: PropTypes.func.isRequired,
  isFetching: PropTypes.func.isRequired,
  fetchCurrencies: PropTypes.func.isRequired,
  expenses: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  fetchCurrencies: () => dispatch(fetchCurrenciesAction()),
  loginUser: (user) => dispatch(loginUserAction(user)),
});

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  isFetching: state.wallet.isFetching,
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
