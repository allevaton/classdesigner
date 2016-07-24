import React, {Component, PropTypes} from "react";
import {observer} from 'mobx-react';

import SemesterSelector from '../components/SemesterSelector';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

import LinearProgress from 'material-ui/LinearProgress';

@observer
export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonStyle: {}
    }
  }

  componentDidMount() {
    this.setState({
      buttonStyle: {
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
            style={this.state.buttonStyle}
            onClick={() => {
              store.openDialog('crnDialog');
            }}
          />

          <RaisedButton
            secondary={true}
            label="Export..."
            style={{
              ...this.state.buttonStyle,
              marginLeft: 20
            }}
            onClick={() => {
              store.openDialog('exportDialog');
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
