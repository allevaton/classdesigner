import React, {PropTypes, Component} from 'react';

import AutoComplete from 'material-ui/AutoComplete';

const dataStoreConfig = {
  text: 'text',
  value: 'value'
};

// based off AutoComplete.caseInsensitiveFilter
function caseInsensitiveFilter(searchText, key, item) {
  return item[dataStoreConfig.value].toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
}

export default class AutoCompleteField extends Component {
  static propTypes = {
    autocompleteData: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    value: PropTypes.string.isRequired
  };

  render() {
    let {
      autocompleteData,
      onChange,
      tabIndex,
      value,
      ...rest
    } = this.props;

    // console.log(autocompleteData);
    return (
      <AutoComplete
        searchText={value}
        onUpdateInput={(text) => {
          onChange(text);
        }}
        onNewRequest={(text) => {
          onChange(text.text)
        }}
        tabIndex={tabIndex}
        dataSource={autocompleteData}
        dataSourceConfig={dataStoreConfig}
        filter={caseInsensitiveFilter}
        {...rest}
      />
    )
  }
}

