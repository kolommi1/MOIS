import React, {Component} from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import MainPage from "./MainPage";

class App extends Component {
  render() {
    return (
      <div className="App">

          <MainPage/>
            {/*<Tabs>
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
            </Tabs>*/}

      </div>
    );
  }

}

export default App;
