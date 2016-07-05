import React, {Component, PropTypes} from "react";
import {observer} from 'mobx-react';

import SemesterSelector from '../components/SemesterSelector';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

import LinearProgress from 'material-ui/LinearProgress';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';

@observer
export default class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      crnButtonStyle: {}
    }
  }
  componentDidMount() {
    this.setState({
      crnButtonStyle: {
        marginTop: '13px',
        height: '36px'
      }
    });
  }

  render() {
    let {store} = this.props;
    return (
      <div>
        <AppBar
          title="Wentworth Class Schedule Designer"
          iconElementLeft={<div></div>}
          style={{
            backgroundColor: '#34495e'
          }}
        >
          <SemesterSelector
            options={store.semesterOptions}
            selected={store.selectedSemester || 'default'}
            onChange={(e, key, value) => {
              store.changeSemester(value);
            }}
          />
          <RaisedButton
            secondary={true}
            label="Get CRNs"
            style={this.state.crnButtonStyle}
            onClick={() => {
            }}
          />
        </AppBar>

        <LinearProgress
          color="#FF4081"
          style={{backgroundColor: 'white'}}
          value={0}
          mode={store.isLoadingData ? 'indeterminate' : 'determinate'}
        />
      </div>
    )
  }
}
