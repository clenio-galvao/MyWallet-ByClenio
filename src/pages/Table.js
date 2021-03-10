import React from 'react';
import PropTypes from 'prop-types';
function Table(props) {
  function cabecalho() {
    return (
      <thead className="table-secondary">
        <tr>
          <th scope="col">Descrição</th>
          <th scope="col">Tag</th>
          <th scope="col">Método de pagamento</th>
          <th scope="col">Valor</th>
          <th scope="col">Moeda</th>
          <th scope="col">Câmbio utilizado</th>
          <th scope="col">Valor convertido</th>
          <th scope="col">Moeda de conversão</th>
          <th scope="col">Editar/Excluir</th>
        </tr>
      </thead>
    );
  }

  const { expenses, edit, deleteExpense } = props;
  return (
    <div class="table-responsive">
      <table className="table table-bordered table-striped">
        { cabecalho() }
        <tbody>
          { Object.keys(expenses).map((id) => (
            <tr key={ id }>
              <th scope="row">{ expenses[id].description }</th>
              <td>{ expenses[id].tag }</td>
              <td>{ expenses[id].method }</td>
              <td>{ expenses[id].value }</td>
              <td>{ expenses[id].exchangeRates[expenses[id].currency].name }</td>
              <td>
                {
                  parseFloat(expenses[id].exchangeRates[expenses[id].currency].ask)
                    .toFixed(2)
                }
              </td>
              <td>
                {
                  parseFloat((expenses[id].value)
                  * (expenses[id].exchangeRates[expenses[id].currency].ask))
                    .toFixed(2)
                }
              </td>
              <td>Real</td>
              <td>
                <button className='btn btn-info btn-m' type="button" onClick={ () => edit(id) }
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button
                  type="button"
                  data-testid="delete-btn"
                  class="btn btn-danger btn-s"
                  onClick={ () => deleteExpense(id, expenses[id].value)}
                >
                  <i className="fas fa-ban"></i>
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  expenses: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  deleteExpense: PropTypes.func.isRequired,
};


export default Table;
