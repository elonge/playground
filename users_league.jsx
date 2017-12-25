import React, {Component} from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

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
      return (
        <div>
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
                >Total</TableHeaderColumn>
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
                  >{row.totalPoints}</TableRowColumn>
                </TableRow>
                ))}
            </TableBody>
          </Table>
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
