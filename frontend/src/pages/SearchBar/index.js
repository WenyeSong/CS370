import React from 'react';
import './index.css';
import { Autocomplete } from './AutocompleteFunctions';
import {Input, message} from 'antd'

class AutocompleteComponent extends React.Component {
  componentDidMount() {
    const info = () => {
      message.info('enter the complete word  as a practice！');
    };
    Autocomplete(document.getElementById("myInput"), info);
  }

  render() {
    return <Input id="myInput" type="text" name="myCountry" {...this.props} />;
  }
}

export default AutocompleteComponent;
