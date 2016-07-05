import React, {PropTypes, Component} from 'react';
import {observer} from 'mobx-react';

import {getColor, getLineColor} from '../constants/courseColors';

import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';
// import AutoComplete from '../containers/AutoComplete';

import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';

import ClassList from '../containers/ClassList';

// based off AutoComplete.caseInsensitiveFilter
function caseInsensitiveFilter(searchText, key, item) {
  return item.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
}

@observer
export default class CourseItem extends Component {
  static propTypes = {
    autocompleteData: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    tabIndex: PropTypes.number,
    store: PropTypes.object,
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
    let {autocompleteData, index, name, onChange, store, style, tabIndex} = this.props;

    return (
      <Card
        style={{
          ...style,
          marginBottom: '20px',
          backgroundColor: getColor(index)
        }}
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
        className="courselist-card"
      >
        <CardHeader
          title={
            <AutoComplete
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              store={store}
              id={`courseEntry${index}`}
              searchText={name}
              onUpdateInput={(text) => {
                onChange(text);
              }}
              onNewRequest={(text) => {
                onChange(text.text)
              }}
              inputStyle={{
                fontWeight: 'normal',
                color: 'white'
              }}
              underlineFocusStyle={{
                borderColor: getLineColor(index)
              }}
              tabIndex={tabIndex}
              dataSource={autocompleteData}
              // filter={fuzzyFilter}
              filter={caseInsensitiveFilter}
              maxSearchResults={10}
              menuCloseDelay={100}
              menuStyle={{
                width: '512px'
              }}
              listStyle={{
                width: '512px'
              }}
            />
          }
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
          <ClassList
            course={name}
            courseIndex={index}
            store={store}
            onCheckboxCheck={(selected, index, classData) => {
              store.selectClass(selected, index, classData);
            }}
          />
        </CardText>
      </Card>
    )
  }
}
