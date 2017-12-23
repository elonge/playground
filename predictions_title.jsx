import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Info from 'material-ui-icons/Info';
import {red500, green500, blue500, indigo50} from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import SocialPeople from 'material-ui/svg-icons/social/people';


const leftIconStyle = {
  marginTop: 0,
  width: '40px',
  height: '40px',
  float: 'left',
};

const rightIconStyle = {
  marginTop: 0,
  width: '40px',
  height: '40px',
  float: 'right',
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
    try {
      let dateTitle = '5 Q\'s about ' + this.renderPrettyDate() + ' games';
      let togglePoints = (
        <IconButton>
          <SocialPeople
            onClick ={() => this.props.onUsersToggle()}
          />
        </IconButton>
      );
      let daysController = (
        <div>
          <IconButton>
            <KeyboardArrowLeft
              onClick={() => this.props.onPrevDayClick()}
              style={leftIconStyle}
              color={this.props.isPrevDay() ? blue500 : indigo50}
            />
          </IconButton>
          <Subheader style={h1Style}>{dateTitle}</Subheader>
          <IconButton>
            <KeyboardArrowRight
              onClick={() => this.props.onNextDayClick()}
              style={rightIconStyle}
              color={this.props.isNextDay() ? blue500 : indigo50}
            />
          </IconButton>
          {togglePoints}
        </div>
      );
      return (
        <div>
          {daysController}
        </div>
      );
    } catch (e) { alert('PredictionsTitle: ' + e.message); }
  }
};


PredictionsTitle.PropTypes = {
};

export default PredictionsTitle;
