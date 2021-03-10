import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCurrencies as fetchCurrenciesAction, logout as logoutAction } from '../actions';
import Table from './Table';
import { firebaseDb} from '../auth/config';
import { AuthContext } from '../auth/AuthContext';

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
            alert('Alguma coisa deu errado não sei pq!');
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

  useEffect(() => {
    const { fetchCurrencies } = props;
    fetchCurrencies();
    console.log(user.uid)
    firebaseDb.child(user.uid).on('value', (snapshot) => {
      if(snapshot.val() !== null) {
        setWalletUser({ ...snapshot.val() })
      }
    })
  }, []);

  useEffect(() => {
    let soma = 0;
    Object.keys(walletUser).map((id) => {
      return soma += parseFloat(walletUser[id].value)
      * parseFloat(walletUser[id].exchangeRates[walletUser[id].currency].ask);
    });
    return setTotal(soma)
  }, [walletUser]);

  async function getRates() {
    const currenciesResponse = await fetch('https://economia.awesomeapi.com.br/json/all');
    const currenciesJason = await currenciesResponse.json();
    setEstado({ ...estado, exchangeRates: currenciesJason });
  }
  
  useEffect(  () => {
    getRates()
  }, []);

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
    const { logout } = props;
    return (
      <header className="navbar bg-secondary topbar w-100">
        <div>My Wallet - By Clênio</div>
        <div className="d-flex align-items-center w-50 justify-content-between">
          <div className="d-flex align-items-center w-25 justify-content-end">
            Olá
            <div className="ml-2" data-testid="total-field">{ `${user.email.split('@', 1)},` }</div>
          </div>
          <div className="d-flex align-items-center w-50 justify-content-around">
            Você já gastou:
            <div className="d-flex align-items-center">
              <div data-testid="total-field">{ total.toFixed(2) }</div>
              <div data-testid="header-currency-field" className="ml-1">BRL</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ligth"
            onClick={() => {
              logout();
            }}
          >
            Sair
          </button>
        </div>
      </header>
    );
  }

  function valueInput() {
    const { value, description } = estado;
    return (
      <>
        <div className="m-2">
          <label htmlFor="description-input" className="form-label">
            Com o que foi gasto?
            <input
              name="description-input"
              className="form-control"
              type="text"
              data-testid="description-input"
              value={ description }
              onChange={ (e) => setEstado({ ...estado, description: e.target.value }) }
            />
          </label>
          <label htmlFor="value-input" className="form-label ml-2">
            Valor:
            <input
              value={ value }
              className="form-control"
              onChange={ (e) => setEstado({ ...estado, value: e.target.value }) }
              name="value-input"
              type="number"
              data-testid="value-input"
            />
          </label>
        </div>
        
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
    const { isFetching, currencies } = props;
    const { method, tag, currency } = estado;
    return (
      isFetching ? <p> loading </p>
        : (
          <section className="w-75">
            <form
              className="border m-2 d-flex flex-column align-items-center bg-light bg-gradient"
              onSubmit={ handleClick }
            >
              { valueInput() }
              <div className="m-2">
                <label htmlFor="tag-input" className="form-label m-2">
                  Método de pagamento:
                  <select
                    data-testid="method-input"
                    className="form-select"
                    value={ method }
                    onChange={ (e) => setEstado({ ...estado, method: e.target.value }) }
                  >
                    {metPg.map((mpg, ind) => (
                      <option key={ ind } value={ mpg }>
                        { mpg }
                      </option>))}
                  </select>
                </label>
                <label htmlFor="tag-input" className="form-label">
                  Categoria (tag):
                  <select
                    className="form-select form-select-lg"
                    id="tag-input"
                    value={ tag }
                    onChange={ (e) => setEstado({ ...estado, tag: e.target.value }) }
                  >
                    {tags.map((categ, ind) => (
                      <option key={ ind } value={ categ }>
                        { categ }
                      </option>))}
                  </select>
                </label>
                <label className="form-label m-2">
                  Moeda:
                  <select
                    value={ currency }
                    className="form-select form-select-lg"
                    onChange={ (e) => setEstado({ ...estado, currency: e.target.value }) }
                    data-testid="currency-input"
                    >
                    { currencies.map((moeda, index) => (
                      <option key={ index } value={ moeda } data-testid={ moeda }>
                        { moeda }
                      </option>))}
                  </select>
                </label>
              </div>
              <button type="submit" className="btn btn-danger m-2">
                { !currentId ? 'Adicionar despesa' : 'Modificar despesa'}
              </button>
            </form>
          </section>
        )
    );
  }

  return (
    <section className="d-flex flex-column align-items-center">
      { header() }
      { forms() }
      <Table
        deleteExpense={ deleteExpense }
        expenses={ walletUser }
        edit={ edit }
      />
    </section>
  );
}

Wallet.propTypes = {
  currencies: PropTypes.func.isRequired,
  isFetching: PropTypes.func.isRequired,
  fetchCurrencies: PropTypes.func.isRequired,
  expenses: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  fetchCurrencies: () => dispatch(fetchCurrenciesAction()),
  logout: () => dispatch(logoutAction()),
});

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  isFetching: state.wallet.isFetching,
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
