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
  'margin-left': 16,
};

const rightIconStyle = {
  'margin-right': 16,
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

  render() {
    return (
      <div style={{backgroundColor: '#FAFAFA'}} >
        <FloatingActionButton disabled={!this.props.isPrevDay()} style={leftIconStyle} mini={true}>
          <KeyboardArrowLeft
            onClick={() => this.props.onPrevDayClick()}
          />
        </FloatingActionButton>
        <label style={{fontSize:16, fontFamily:'Roboto', paddingLeft:14}}>{this.props.title}</label>
        <FloatingActionButton style={rightIconStyle} disabled={!this.props.isNextDay()} mini={true}>
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
