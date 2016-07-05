import React, {PropTypes, Component} from 'react';
import {observer} from 'mobx-react';

import {getLineColor} from '../constants/courseColors';

import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';

@observer
export default class ClassList extends Component {
  static propTypes = {
    course: PropTypes.string.isRequired,
    courseIndex: PropTypes.number,
    onCheckboxCheck: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      classData: this.sortByCRN(props.store.getClasses(props.course))
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      classData: this.sortByCRN(this.props.store.getClasses(nextProps.course))
    });
  }

  sortByCRN(classes) {
    return classes.sort((a, b) => Number(a.crn) - Number(b.crn));
  }

  classFormat(classItem) {
    // return `${classItem.crn} ${classItem.instructor} | ${classItem.days} | ${classItem.time}`;
    return `${classItem.instructor} | ${classItem.days} | ${classItem.time}`;
  }

  divider(index) {
    // if (!index)
    //   return <Divider />;

    return (
      <Divider
        style={{
          backgroundColor: getLineColor(index)
        }}
      />
    );
  }

  render() {
    let {course, courseIndex, onCheckboxCheck, store, style} = this.props;

    let checkboxProperties = {
      iconStyle: {
        fill: 'black'
        // fill: getLineColor(courseIndex)
      },
      onCheck: onCheckboxCheck
    };

    return (
      <List style={{
        ...style
      }}>
        {course.length === 0 ? <Subheader>Enter a course</Subheader> :
          this.state.classData && this.state.classData.length === 0 ? <Subheader>No classes found</Subheader> : ''}

        {this.state.classData.reduce((prev, cur, i, arr) => {
          if (cur && cur.title.endsWith('-Lab'))
            return prev;

          let curItemProps = {
            leftCheckbox: (
              <Checkbox
                {...checkboxProperties}
                onCheck={(e, checked) => onCheckboxCheck(checked, courseIndex, cur)}
                checked={!!store.selectedClasses[courseIndex].find(c => c === cur)}
              />),
            initiallyOpen: true,
            key: `class${i}`,
            nestedListStyle: {
              padding: 0
            },
            primaryText: this.classFormat(cur)
          };

          let lastOne = arr[i - 1];
          let next = arr[i + 1];

          if (next && next.title.endsWith('-Lab')) {
            return [
              ...prev,
              <ListItem
                {...curItemProps}

                nestedItems={[(
                  <ListItem
                    leftCheckbox={
                      <Checkbox
                        {...checkboxProperties}
                        onCheck={(e, checked) => onCheckboxCheck(checked, courseIndex, next)}
                        checked={!!store.selectedClasses[courseIndex].find(c => c === next)}
                     />
                    }
                    key={`classLab${i}`}
                    primaryText={this.classFormat(next)}
                    secondaryText="LAB SECTION"
                  />)
                ]}
              />,

              // make sure this isn't the very last item by checking the one after `next`
              arr[i + 2] && (next.crn !== cur.crn) ? this.divider(courseIndex) : <div></div>
            ];
          }

          return [
            ...prev,
            lastOne && lastOne.crn !== cur.crn ? this.divider(courseIndex) : <div></div>,
            <ListItem {...curItemProps} />
          ]
        }, [])}
      </List>
    )
  }
}
