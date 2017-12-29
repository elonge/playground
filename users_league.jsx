import React, {Component} from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField';
import PredictionsTitle from './predictions_title.jsx';
import TodayPredictions from './today_predictions.jsx';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
  maxHeight: '95% !important'
};


class UsersLeague extends React.Component {
  constructor(props) {
    try {
      super(props);
      this.state = {
        usersPoints: props.usersPoints,
      };
      this.isPrevDay = this.isPrevDay.bind(this);
      this.isNextDay = this.isNextDay.bind(this);
    } catch (e) { alert('UsersLeague: ' + e.message); }
  }

  isNextDay() {
    return false;
  }

  isPrevDay() {
    return false;
  }

  render() {
    try {
      let tableElement = (
        <Table
          height='300px'
          fixedHeader={true}
          selectable={true}
          multiSelectable={false}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn
              >Rank</TableHeaderColumn>
              <TableHeaderColumn
              >Name</TableHeaderColumn>
              <TableHeaderColumn
              >Last Day</TableHeaderColumn>
              <TableHeaderColumn
              >This Week</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway={true}
            stripedRows={false}
          >
            {this.state.usersPoints.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn
                >{index+1}</TableRowColumn>
                <TableRowColumn
                >{row.name}</TableRowColumn>
                <TableRowColumn
                >{row.points1d}</TableRowColumn>
                <TableRowColumn
                >{row.totalPoints}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      );
      let title = "22/12/2017 table";
      let titleElement = (
        <PredictionsTitle
          onNextDayClick = {this.onNextDayClick}
          onPrevDayClick = {this.onPrevDayClick}
          isPrevDay = {this.isPrevDay}
          isNextDay = {this.isNextDay}
          title = {title}
        />
      );
      titleElement = (
        <Subheader style={{fontSize:16}}>{title}</Subheader>
      );
      let leagueSelection = (
        <SelectField
          value="All Users"
        >
        <MenuItem value="All Users" key={0} primaryText="All Users"/>
        <MenuItem value="25 Floor" key={1} primaryText="25 Floor"/>
        <MenuItem value="United fans" key={2} primaryText="United fans"/>
        </SelectField>
      );
      return (
        <div>
        <span style={{flexDirection: 'row', display:'flex'}}>
          {titleElement}
          {leagueSelection}
        </span>
          {tableElement}
        </div>
      );
    } catch (e) {
      alert('UsersLeague exception ' + e.message);
    }
  }
};

UsersLeague.PropTypes = {
};

export default UsersLeague;
