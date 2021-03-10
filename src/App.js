import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRote';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import Cadastro from './pages/Cadastro';
import store from './store';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <Provider store={ store }>
            <PrivateRoute exact path="/" component={ Wallet } />
            <Route path="/login" component={ Login } />
            <Route path="/cadastro" component={ Cadastro } />
          </Provider>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
