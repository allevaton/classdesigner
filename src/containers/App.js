import React, {Component, PropTypes} from "react";
import {observer} from 'mobx-react';

import {StickyContainer, Sticky} from 'react-sticky';

import CourseList from '../containers/CourseList';
import Header from '../containers/Header';
import Calendar from '../components/Calendar';
import SemesterSelectionDialog from '../containers/SemesterSelectionDialog';
import CRNDialog from '../containers/CRNDialog';
import ExportDialog from '../containers/ExportDialog';

import moment from 'moment';
import BigCalendar from 'react-big-calendar';
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

@observer
export default class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.store.fetchIndex();
    this.props.store.openDialog('semesterSelection');
  }

  render() {
    let {store} = this.props;

    return (
      <div>
        <Header store={store}/>
        <StickyContainer className="container">
          
          <CourseList store={store}/>
          
          <Sticky
            topOffset={-20}
            stickyStyle={{
             paddingTop: 20,
             height: '100%'
            }}
          >
            <Calendar
              calendarEvents={store.calendarEvents || []}
              className="calendar"
            />
          </Sticky>
        </StickyContainer>
        <SemesterSelectionDialog store={store}/>
        <CRNDialog store={store}/>
        <ExportDialog store={store}/>
      </div>
    );
  }
};
