import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import {red500, green500, blue500, indigo50} from 'material-ui/styles/colors';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';


const style = {
  margin: 12,
};

const leftIconStyle = {
  marginTop: 0,
};

const rightIconStyle = {
  marginTop: 0,
  float: 'right'
};


const h1Style = {
  display: 'inline',
  'font-size': '18px',
  'padding-left' : '0px',
  float: 'middle'
};

/*
 * The title of the daily predictions list
 */
class PredictionsTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  // FFU
  renderPrettyDate() {
    var today = new Date();
    if (today.toLocaleDateString() == new Date(this.props.viewedDate).toLocaleDateString()) {
      return "today's";
    }
    var yesterday = new Date(today.setDate(today.getDate() - 1));
    if (yesterday.toLocaleDateString() == new Date(this.props.viewedDate).toLocaleDateString()) {
      return "yesterday's";
    }
    return new Date(this.props.viewedDate).toLocaleDateString();
  }


  render() {
    return (
      <div>
        <FloatingActionButton disabled={!this.props.isPrevDay()} style={leftIconStyle}>
          <KeyboardArrowLeft
            onClick={() => this.props.onPrevDayClick()}
          />
        </FloatingActionButton>
        <FloatingActionButton style={rightIconStyle} disabled={!this.props.isNextDay()}>
          <KeyboardArrowRight
            onClick={() => this.props.onNextDayClick()}
          />
        </FloatingActionButton>
      </div>
    );
  }
};


PredictionsTitle.PropTypes = {
};

export default PredictionsTitle;
