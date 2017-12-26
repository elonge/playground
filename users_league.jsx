import React, {Component} from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import TodayPredictions from './today_predictions.jsx'

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
      dialogOpen: false,
      selectedRow: 0,
    };
    this.onRowClick = this.onRowClick.bind(this);
    this.getSpecificUserPredictions = this.getSpecificUserPredictions.bind(this);

    } catch (e) { alert('UsersLeague: ' + e.message); }
  }

  getSpecificUserPredictions(userId) {
    return this.props.userPredictions.filter(prediction => prediction.user_id == userId);
  }

  handleDialogClose() {
    this.setState({dialogOpen: false});
  };

  onRowClick(rowNumber, columnId) {
    let current = this.state.dialogOpen;
    this.setState({dialogOpen: !current, selectedRow:rowNumber});
  }

  render() {
    try {
      let dialogElement;
      if (this.state.dialogOpen) {
        dialogElement = (
          <Dialog
            title={this.props.usersPoints[this.state.selectedRow].name + "'s predictions "}
            modal={false}
            open={this.state.dialogOpen}
            onRequestClose={() => this.handleDialogClose()}
            autoScrollBodyContent={true}
          >
          <TodayPredictions
            userPredictions={this.getSpecificUserPredictions(this.props.usersPoints[this.state.selectedRow].fbId)}
            forceEnable={true}
            otherUserMode={true}
          />
          </Dialog>
        );
      }
      return (
        <div>
          {dialogElement}
          <Table
            height='300px'
            fixedHeader={true}
            selectable={true}
            multiSelectable={false}
            onCellClick={this.onRowClick}
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
                  >{row.points1d}</TableRowColumn>
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
