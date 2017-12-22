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
      const rankColumnStyle = { width: 12 };
      const nameColumnStyle = { 'font-weight': 'bold', width: 'auto' };
      const totalColumnStyle = { 'text-align' : 'right', width: 30 };

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
                  style={rankColumnStyle}
                >Rank</TableHeaderColumn>
                <TableHeaderColumn
                  style={nameColumnStyle}
                >Name</TableHeaderColumn>
                <TableHeaderColumn
                  style={totalColumnStyle}
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
                    style={rankColumnStyle}
                  >{index+1}</TableRowColumn>
                  <TableRowColumn
                    style={nameColumnStyle}
                  >{row.name}</TableRowColumn>
                  <TableRowColumn
                    style={totalColumnStyle}
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
