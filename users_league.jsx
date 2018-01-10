import React, {Component} from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField';
import PredictionsTitle from './predictions_title.jsx';
import FlatButton from 'material-ui/FlatButton';

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
      weeks: props.usersPoints.map(user => user.sunday).filter((v, i, a) => a.indexOf(v) === i).sort().reverse(),
      leagues: props.leagues,
      viewedLeagueIndex: props.viewedLeagueIndex,
    };
    this.onCellClick = this.onCellClick.bind(this);
  }

  // Called when switching to new viewed league or moving date
  componentWillReceiveProps(nextProps) {
    this.setState( {
      viewedWeekIndex: nextProps.viewedWeekIndex,
      usersPoints: nextProps.usersPoints,
      viewedLeagueIndex: nextProps.viewedLeagueIndex,
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

  formatDateAsDB(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onCellClick(rowNumber, columnId) {
    const {
      usersPoints,
      viewedWeekIndex,
      weeks,
      viewedLeagueIndex,
      leagues,
    } = this.state;

    let weekPoints = usersPoints.filter(user => (user.sunday == weeks[viewedWeekIndex] && user.league == leagues[viewedLeagueIndex].id));
    this.props.onUserClick(weekPoints[rowNumber]);
  }

  render() {
    const {
      usersPoints,
      viewedWeekIndex,
      weeks,
      viewedLeagueIndex,
      leagues,
    } = this.state;

    let weekPoints = usersPoints.filter(user => (user.sunday == weeks[viewedWeekIndex] && user.league == leagues[viewedLeagueIndex].id));
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
        onCellClick={this.onCellClick}
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
          stripedRows={true}
        >
          {weekPoints.map( (row, index) => (
            <TableRow key={index}>
              <TableRowColumn
              >{index+1}</TableRowColumn>
              <TableRowColumn>
                <FlatButton label={row.name} primary={true} />
              </TableRowColumn>
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
    let weekHuman = this.formatDateAsDB(weeks[viewedWeekIndex]);
    if (this.isLastSunday(weekHuman)) {
      title = weekHuman + " table";
    } else {
      title = weekHuman + " final table";
    }
    let titleElement = (
      <Subheader style={{fontSize:16}}>{title}</Subheader>
    );

    let leagueItems = leagues.map((league, index) => (
      <MenuItem value={index} key={index} primaryText={league.league_name} />
    ));
    let leagueSelection = (
      <SelectField
        value={viewedLeagueIndex}
        onChange={this.props.onLeagueChanged}
      >
      {leagueItems}
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
