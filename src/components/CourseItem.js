import React, {PropTypes, Component} from 'react';
import {observer} from 'mobx-react';

import {getColor, getLineColor} from '../constants/courseColors';

import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
// import AutoComplete from 'material-ui/AutoComplete';

import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';

import ClassList from '../containers/ClassList';

@observer
export default class CourseItem extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded});
  };

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  render() {
    let {
      backgroundColor,
      style,
      title
    } = this.props;

    return (
      <Card
        style={{
          ...style,
          backgroundColor,
          marginBottom: '20px'
        }}
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
        className="courselist-card"
      >
        <CardHeader
          title={title}
          onClick={this.toggleExpand}
          textStyle={{
            paddingRight: 0
          }}
        >
          <IconButton style={{float: 'right'}} iconStyle={{fill: 'white'}}>
            {this.state.expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>

          {/*<IconButton
           style={{float: 'right'}}
           iconStyle={{fill: 'white'}}
           onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           }}
           >
           <SettingsIcon />
           </IconButton>*/}
        </CardHeader>

        <CardText
          expandable={true}
          style={{
            padding: 0,
            paddingRight: '12px'
          }}
        >
          {this.props.children}
        </CardText>
      </Card>
    )
  }
}
