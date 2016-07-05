import React, {Component, PropTypes} from "react";

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class SemesterSelector extends Component {
  static propTypes = {
    defaultText: PropTypes.string,
    dropDownProps: PropTypes.object,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired,
    style: PropTypes.object
  };

  render() {
    let {defaultText, dropDownProps, onChange, options, selected, style} = this.props;

    return (
      <DropDownMenu
        value={selected}
        labelStyle={{color: 'white'}}
        onChange={onChange}
        style={style}
        {...dropDownProps}
      >
        <MenuItem
          value={'default'}
          primaryText={defaultText || "Select a semester"}
          disabled={true}
        />
        {options.map((option, i) => {
          return (
            <MenuItem
              key={`semesterOption${i}`}
              value={option.value}
              primaryText={option.label}
            />
          )
        })}
      </DropDownMenu>
    )
  }
}
