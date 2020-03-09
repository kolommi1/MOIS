import React, {Component} from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import Table from "./Table";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Table />
        </header>
      </div>
    );
  }

}

export default App;
