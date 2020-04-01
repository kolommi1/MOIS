import React, {Component} from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import Tabs from "./Tabs";
import CategoryJidlo from "./CategoryJidlo";
import CategoryObleceni from "./CategoryObleceni";
import CategoryCestovani from "./CategoryCestovani";
import CategoryHygiena from "./CategoryHygiena";
import CategoryBydleni from "./CategoryBydleni";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

            <Tabs>
                <div name="Jídlo">
                    <CategoryJidlo></CategoryJidlo>
                </div>
                <div name="Oblečení">
                    <CategoryObleceni></CategoryObleceni>
                </div>
                <div name="Cestování">
                    <CategoryCestovani></CategoryCestovani>
                </div>
                <div name="Hygiena">
                    <CategoryHygiena></CategoryHygiena>
                </div>
                <div name="Bydlení">
                    <CategoryBydleni></CategoryBydleni>
                </div>
            </Tabs>

        </header>
      </div>
    );
  }

}

export default App;
