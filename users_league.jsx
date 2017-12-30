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
    super(props);
    this.state = {
      usersPoints: props.usersPoints,
      viewedWeekIndex: props.viewedWeekIndex,
      weeks: props.usersPoints.map(user => user.sunday).filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
    };
  }

  // Called when switching to new viewed league or moving date
  componentWillReceiveProps(nextProps) {
    this.setState( {
      viewedWeekIndex: nextProps.viewedWeekIndex,
      usersPoints: nextProps.usersPoints,
      weeks: nextProps.usersPoints.map(user => user.sunday).filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
    });
  }

  isLastSunday(myWeek) {
    var t = new Date();
    t.setDate(t.getDate() - t.getDay());
    var month = '' + (t.getMonth() + 1);
    var day = '' + (t.getDate());
    var year = t.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return ([year, month, day].join('-') == myWeek);
  }

  render() {
    const {
      usersPoints,
      viewedWeekIndex,
      weeks,
    } = this.state;

    let weekPoints = usersPoints.filter(user => user.sunday == weeks[viewedWeekIndex]);

    if (weekPoints.length == 0)  {
      return (
        <label>Debug3</label>
      );
    }

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
          {weekPoints.map( (row, index) => (
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
    let title;
    if (this.isLastSunday(weeks[viewedWeekIndex])) {
      title = weeks[viewedWeekIndex] + " table";
    } else {
      title = weeks[viewedWeekIndex] + " final table";
    }
    let titleElement = (
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
  }
};

UsersLeague.propTypes = {
};

export default UsersLeague;
