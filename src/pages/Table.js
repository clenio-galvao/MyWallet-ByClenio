import React from 'react';
import PropTypes from 'prop-types';
function Table(props) {
  function cabecalho() {
    return (
      <tr>
        <th>Descrição</th>
        <th>Tag</th>
        <th>Método de pagamento</th>
        <th>Valor</th>
        <th>Moeda</th>
        <th>Câmbio utilizado</th>
        <th>Valor convertido</th>
        <th>Moeda de conversão</th>
        <th>Editar/Excluir</th>
      </tr>
    );
  }

  const { expenses, edit, deleteExpense } = props;
  return (
    <table>
      { cabecalho() }
      { Object.keys(expenses).map((id) => (
        <tr key={ expenses[id].id }>
          <td>{ expenses[id].description }</td>
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
            <button type="button" onClick={ () => edit(id) }
            >
              editar
            </button>
            <button
              type="button"
              data-testid="delete-btn"
              onClick={ () => deleteExpense(id, expenses[id].value)}
            >
              x
            </button>
          </td>
        </tr>
      )) }
    </table>
  );
}

Table.propTypes = {
  expenses: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  deleteExpense: PropTypes.func.isRequired,
};


export default Table;
