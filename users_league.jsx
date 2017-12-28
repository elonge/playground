import React, {Component} from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

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
    } catch (e) { alert('UsersLeague: ' + e.message); }
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
      return (
        <div>
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
