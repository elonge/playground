import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

class CreateLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      isCreate: props.isCreate,
      newLeagueName: '',
      enteredCode: '',
      newLeagueCode: '',
      newLeagueError: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      enteredCode: '',
      snackbarMessage: '',
    };
    this.onNewLeagueNameChanged = this.onNewLeagueNameChanged.bind(this);
    this.onCodeUpdated = this.onCodeUpdated.bind(this);
    this.onCreateLeague = this.onCreateLeague.bind(this);
    this.onGetLeagueByCode = this.onGetLeagueByCode.bind(this);
    this.onInviteFriends = this.onInviteFriends.bind(this);
    this.onApproveJoining = this.onApproveJoining.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.renderCreateLeague = this.renderCreateLeague.bind(this);
    this.renderJoinLeague = this.renderJoinLeague.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onCreateLeagueServerResponse = this.onCreateLeagueServerResponse.bind(this);
    this.onGetLeagueServerResponse = this.onGetLeagueServerResponse.bind(this);
    this.onJoinLeagueServerResponse = this.onJoinLeagueServerResponse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState( {
      open: nextProps.open,
      isCreate: nextProps.isCreate,
      newLeagueName: '',
      enteredCode: '',
      newLeagueCode: '',
      newLeagueError: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      enteredCode: '',
      snackbarMessage: '',
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
    this.setState({open: false, snackbarMessage: ''});
  };

  onNewLeagueNameChanged(event) {
    this.setState({newLeagueName: event.target.value});
  }

  onCodeUpdated(event) {
    this.setState({enteredCode: event.target.value});
  }

  onInviteFriends() {
    alert("invite friends");
  }

  onApproveJoining() {
    this.pushToRemote("league:join", {leagueId: this.state.joinLeague.id}, this.onJoinLeagueServerResponse);
  }

  onJoinLeagueServerResponse(channel, response) {
    if (response.startsWith("ok")) {
      let snackbarMessage = 'Joined league ' + this.state.joinLeague.league_name;
      this.setState({snackbarMessage:snackbarMessage});
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
      this.setState({newLeagueError:'', newLeagueCode: response.substring(4)});
    } else {
      this.setState({newLeagueError:response, newLeagueCode: ''});
    }
  }

  renderCreateLeague() {
    let isCode = this.state.newLeagueCode.length > 0;
    let isSnack = this.state.snackbarMessage.length > 0;
    const actions = [
      <FlatButton
        label={isCode ? "Exit" : "Cancel"}
        primary={true}
        keyboardFocused={true}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isCode ? "Invite friends..." : "Create a league"}
        primary={true}
        keyboardFocused={true}
        onClick={isCode ? this.onInviteFriends : this.onCreateLeague}
        disabled = {isSnack || this.state.waitingToServer}
      />,
    ];

    return (
      <Dialog
        title="Create a new league"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
      >
      <div>
        <TextField
          value={this.state.newLeagueName}
          onChange={this.onNewLeagueNameChanged}
          errorText={this.state.newLeagueError}
          hintText="Please enter a unique league name"
        /><br />
        <TextField
          disabled={true}
          hintText="League Code"
          value={(isCode ? 'League created! Code is ' + this.state.newLeagueCode : '')}
        /><br />
      </div>
      </Dialog>
    );
  }

  renderJoinLeague() {
    let isLeague = this.state.joinLeague != null;
    let isSnack = this.state.snackbarMessage.length > 0;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        disabled = {isSnack}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isLeague ? "Approve Joining" : "Join league..."}
        primary={true}
        keyboardFocused={true}
        disabled = {isSnack || this.state.waitingToServer}
        onClick={isLeague ? this.onApproveJoining : this.onGetLeagueByCode}
      />,
    ];

    return (
      <Dialog
        title="Join a league"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
      >
        <div>
          <TextField
            disabled={false}
            hintText="Please enter the league code"
            value={this.state.enteredCode}
            errorText={this.state.joinLeagueError}
            onChange={this.onCodeUpdated}
          /><br />
          <TextField
            value={isLeague ?"League name is " + this.state.joinLeague.league_name : ""}
            disabled={true}
            hintText="League name"
          /><br />
          <Snackbar
            open={isSnack}
            message={this.state.snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.onDialogCancel}
          />
        </div>
      </Dialog>
    );
  }

  render() {
    if (this.state.isCreate) {
      return this.renderCreateLeague();
    } else {
      return this.renderJoinLeague();
    }
  }
}

CreateLeagueDialog.propTypes = {
};

export default CreateLeagueDialog;
