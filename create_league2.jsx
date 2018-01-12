import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
};

class CreateLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      newLeagueName: '',
      enteredCode: '',
      newLeague: null,
      newLeagueError: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      enteredCode: '',
      snackbarMessage: '',
      dialogEditMode: false,
      leagues: props.leagues,
      users: props.users,
    };
    this.onNewLeagueNameChanged = this.onNewLeagueNameChanged.bind(this);
    this.onCodeUpdated = this.onCodeUpdated.bind(this);
    this.onCreateLeague = this.onCreateLeague.bind(this);
    this.onGetLeagueByCode = this.onGetLeagueByCode.bind(this);
    this.onInviteFriends = this.onInviteFriends.bind(this);
    this.onApproveJoining = this.onApproveJoining.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.renderJoinCreateElement = this.renderJoinCreateElement.bind(this);
    this.renderLeaguesTable = this.renderLeaguesTable.bind(this);
    this.onSnackBarDone = this.onSnackBarDone.bind(this);
    this.onCreateLeagueServerResponse = this.onCreateLeagueServerResponse.bind(this);
    this.onGetLeagueServerResponse = this.onGetLeagueServerResponse.bind(this);
    this.onJoinLeagueServerResponse = this.onJoinLeagueServerResponse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open == this.state.open) {
      // outside changes should not effect dialog (unless dialog is opened/close or change question)
      //this.setState({leagues: nextProps.leagues});
      return;
    }
    console.log("componentWillReceiveProps: leagues=" + JSON.stringify(nextProps.leagues));
    this.setState( {
      open: nextProps.open,
      newLeagueName: '',
      enteredCode: '',
      newLeague: null,
      newLeagueError: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      enteredCode: '',
      snackbarMessage: '',
      leagues: nextProps.leagues,
      users: nextProps.users,
    });
  }

  pushToRemote(channel, message, statusHandler) {
    this.setState({waitingToServer: true});

    this.props.socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.senderId,
        ...message,
      },
      (status) => {
        console.log(channel + ": " + JSON.stringify(status));

        this.setState({
          waitingToServer:false,
        });

        statusHandler(channel, status);
      }
    );
  }

  onDialogCancel() {
    console.log("onDialogCanel");
    this.setState({open: false, snackbarMessage: ''});
    this.props.handleClose();
  };

  onNewLeagueNameChanged(event) {
    this.setState({newLeagueName: event.target.value});
  }

  onCodeUpdated(event) {
    this.setState({enteredCode: event.target.value});
  }

  onInviteFriends(index) {
    this.props.onInviteNewLeague(this.state.leagues[index]);
  }

  onApproveJoining() {
    this.pushToRemote("league:join", {leagueId: this.state.joinLeague.id}, this.onJoinLeagueServerResponse);
  }

  onJoinLeagueServerResponse(channel, response) {
    console.log("OnJoin approve: " + response);
    if (response.startsWith("ok")) {
      let snackbarMessage = 'Joined league ' + this.state.joinLeague.league_name;
      this.setState({snackbarMessage:snackbarMessage});
      this.props.onNewLeague(this.state.joinLeague);
    } else {
      this.setState({joinLeagueError:response, joinLeague: null});
    }
  }

  onGetLeagueByCode() {
    this.pushToRemote("league:by_code", {leagueCode: this.state.enteredCode}, this.onGetLeagueServerResponse);
  }

  onGetLeagueServerResponse(channel, response) {
    if (response.startsWith("ok: ")) {
      let league = JSON.parse(response.substring(4));
      this.setState({joinLeagueError:'', joinLeague: league});
    } else {
      this.setState({joinLeagueError:response, joinLeague: null});
    }
  }

  onCreateLeague() {
    this.pushToRemote("league:insert", {leagueName: this.state.newLeagueName}, this.onCreateLeagueServerResponse);
  }

  onCreateLeagueServerResponse(channel, response) {
    console.log()
    if (response.startsWith("ok: ")) {
      let league = JSON.parse(response.substring(4));
      this.setState({
        newLeagueError:'',
        newLeague: league,
        snackbarMessage: 'League '+ league.league_name + ' was created. Invite your friends to join'
      });
      this.props.onNewLeague(league);
    } else {
      this.setState({newLeagueError:response, newLeague: null});
    }
  }

  handleToggle = (event, value) => {
    console.log("value=" + value);
    this.setState({dialogEditMode: !this.state.dialogEditMode});
  };

  onSnackBarDone(reason) {
    this.setState({snackbarMessage: '', dialogEditMode:false});
  }

  renderDialogEditModeToggle() {
      return (
        <div>
          <Toggle
            toggled={this.state.dialogEditMode}
            onToggle={this.handleToggle}
            labelPosition="right"
            label={this.state.dialogEditMode ? "Join/Creare Leagues" : "My Leagues" }
          />
          <br />
        </div>
      );
  }

  renderJoinCreateElement() {
    let isLeague = this.state.joinLeague != null;
    let isSnack = this.state.snackbarMessage.length > 0;
    let isCode = this.state.newLeague != null;

    return (
      <div>
        If you were invited to a league and have the code, please enter it here and click JOIN
        <br />
        <TextField
          disabled={false}
          value={!isLeague ? this.state.enteredCode : "Join " + this.state.joinLeague.league_name + "?"}
          errorText={this.state.joinLeagueError}
          onChange={this.onCodeUpdated}
        />
        <FlatButton
          label={isLeague ? "Confirm" : "Join"}
          primary={true}
          disabled={isSnack}
          onClick={isLeague ? this.onApproveJoining : this.onGetLeagueByCode}
        />
        <br />
        <br />
        <br />
        If you want to create a new league, please enter a unique league name here and click CREATE
        <br />
        <TextField
          value={this.state.newLeagueName}
          onChange={this.onNewLeagueNameChanged}
          errorText={this.state.newLeagueError}
          hintText="Please enter a unique league name"
        />
        <FlatButton
          label="create"
          primary={true}
          disabled={isSnack}
          onClick={this.onCreateLeague}
        />
        <br />
      </div>
    );
  }

  renderLeaguesTable() {
    return (
      <Table
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
            >League Name</TableHeaderColumn>
            <TableHeaderColumn
            >Code</TableHeaderColumn>
            <TableHeaderColumn
            >Invite</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={true}
        >
          {this.state.leagues.map( (row, index) => (
            <TableRow key={index}>
              <TableRowColumn
                >{row.league_name}</TableRowColumn>
              {/**}<TableRowColumn
              >{this.props.users.find((user) => user.fbId ===row.owner_id).name}</TableRowColumn> */ }
              <TableRowColumn
                >{row.id == 1 ? "" : row.league_code}</TableRowColumn>
              <TableRowColumn>
                {row.id == 1 ? "" : <FlatButton label="invite" primary={true} onClick={() => this.onInviteFriends(index)} />}
              </TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        disabled = {false}
        onClick={this.onDialogCancel}
      />,
    ];

    let isSnack = this.state.snackbarMessage.length > 0;
    let actionGroup = this.renderDialogEditModeToggle();

    let mainElement;
    if (this.state.dialogEditMode) {
      mainElement = this.renderJoinCreateElement();
    } else {
      mainElement = this.renderLeaguesTable();
    }

    return (
      <Dialog
        title="Private Leagues"
        repositionOnUpdate = {false}
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
        contentStyle={dialogStyle}
        autoDetectWindowHeight={false}
      >
      <div>
      {actionGroup}
      {mainElement}
      <Snackbar
        open={isSnack}
        message={this.state.snackbarMessage}
        autoHideDuration={4000}
        onRequestClose={this.onSnackBarDone}
      />
      </div>
      </Dialog>
    );
  }
}

CreateLeagueDialog.propTypes = {

};

export default CreateLeagueDialog;
