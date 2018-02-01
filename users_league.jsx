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
      leagues: props.leagues,
      currentLeague: props.currentLeague,
      dailyStatMode: props.dailyStatMode,
    };
    this.onCellClick = this.onCellClick.bind(this);
    this.renderLeagueTable = this.renderLeagueTable.bind(this);
    this.renderDailyWinnersTable = this.renderDailyWinnersTable.bind(this);
  }

  // Called when switching to new viewed league or moving date
  componentWillReceiveProps(nextProps) {
    this.setState( {
      usersPoints: nextProps.usersPoints,
      currentLeague: nextProps.currentLeague,
      dailyStatMode: nextProps.dailyStatMode,
    });
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

  formatWinners(winners) {
    if (winners.length == 1) {
      const winner = this.props.users.find((user) => user.fbId == parseInt(winners[0], 10));
      return (winner ? winner.name : "?");
    } else if (winners.length == 2) {
      const winner1 = this.props.users.find((user) => user.fbId == parseInt(winners[0], 10));
      const winner2 = this.props.users.find((user) => user.fbId == parseInt(winners[1], 10));
      return (winner1 ? winner1.name : "?") + " & " + (winner2 ? winner2.name : "?");
    }
    return "Many People";
  }

  onCellClick(rowNumber, columnId) {
    const {
      usersPoints,
      currentLeague,
      leagues,
    } = this.state;

    let leaguePoints = usersPoints.filter(user => user.league == currentLeague.id);
    this.props.onUserClick(leaguePoints[rowNumber]);
  }

  renderDailyWinnersTable() {
    const {
      usersPoints,
      currentLeague,
      leagues,
      dailyStatMode,
    } = this.state;

    const leagueWinners = this.props.leagueDailyWinners.filter(dailyWinner => (dailyWinner.league_id == currentLeague.id));
    return (
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
            <TableHeaderColumn style={{width: '35%'}}
            >Date</TableHeaderColumn>
            <TableHeaderColumn style={{width: '55%'}}
            >Name</TableHeaderColumn>
            <TableHeaderColumn style={{width: '10%', paddingLeft: '0px'}}
            >Points</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={true}
          stripedRows={true}
        >
          {leagueWinners.map( (row, index) => (
            <TableRow key={index}>
              <TableRowColumn style={{width: '35%'}}
              >{this.formatDateAsDB(row.day)}</TableRowColumn>
              <TableRowColumn style={{width: '55%'}}
              >{this.formatWinners(row.winners)}</TableRowColumn>
              <TableRowColumn style={{width: '10%', paddingLeft: '5pt'}}
              >{row.points}</TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }

  renderLeagueTable(leaguePoints) {
    return (
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
            <TableHeaderColumn style={{width: '10%', paddingLeft: '5px'}}
            >Rank</TableHeaderColumn>
            <TableHeaderColumn style={{width: '55%'}}
            ></TableHeaderColumn>
            <TableHeaderColumn style={{width: '15%'}}
            >Last</TableHeaderColumn>
            <TableHeaderColumn style={{width: '20%'}}
            >Total</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={true}
          stripedRows={true}
        >
          {leaguePoints.map( (row, index) => (
            <TableRow key={index}>
              <TableRowColumn style={{width: '10%', paddingLeft:'10px'}}
              >{index+1}</TableRowColumn>
              <TableRowColumn style={{width: '55%'}}>
                <FlatButton label={row.name} primary={true} />
              </TableRowColumn>
              <TableRowColumn style={{width: '15%'}}
              >{row.points1d}</TableRowColumn>
              <TableRowColumn style={{width: '20%'}}
              >{row.totalPoints}</TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }

  render() {
    const {
      usersPoints,
      currentLeague,
      leagues,
      dailyStatMode,
    } = this.state;

    console.log("currentLeague=" + JSON.stringify(currentLeague));
    let leaguePoints = usersPoints.filter(user => user.league == currentLeague.id);
    if (leaguePoints.length == 0)  {
      return (
        <label>Debug3</label>
      );
    }

    let tableElement = (dailyStatMode ? this.renderDailyWinnersTable() : this.renderLeagueTable(leaguePoints));
    let title;
    if (dailyStatMode) {
      title = "Daily winners";
    } else {
      title = "Current table";
    }
    let titleElement = (
      <Subheader style={{fontSize:16}}>{title}</Subheader>
    );

    let leagueItems = leagues.map((league, index) => (
      <MenuItem value={league} key={index} primaryText={league.league_name} />
    ));
    let leagueSelection = (
      <SelectField
        value={currentLeague}
        onChange={this.props.onLeagueChanged}
      >
      {leagueItems}
      </SelectField>
    );
    return (
      <div>
      <span style={{flexDirection: 'row', display:'flex'}}>
        {titleElement}
      </span>
        {tableElement}
      </div>
    );
  }
};

UsersLeague.propTypes = {
};

export default UsersLeague;
