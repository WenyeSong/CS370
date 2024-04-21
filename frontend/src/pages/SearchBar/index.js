import React from 'react';
import './index.css';
import { autocomplete } from './AutocompleteFunctions';
import {Input} from 'antd'

class AutocompleteComponent extends React.Component {
  async componentDidMount() {
    // var arr = fetch(`http://localhost:5000/user/words/${word}`, {method: 'GET'}); // Add all countries here
    var arr = ["hi"]
    autocomplete(document.getElementById("myInput"),arr);
  }

  render() {
    return (
      <Input id="myInput" type="text" name="myCountry" {...this.props} />
    );
  }
}

export default AutocompleteComponent;
