import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import axios from 'axios';

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
      waitingToServer: false,
      enteredCode: '',
    };
    this.onNewLeagueNameChanged = this.onNewLeagueNameChanged.bind(this);
    this.onCodeUpdated = this.onCodeUpdated.bind(this);
    this.onCreateLeague = this.onCreateLeague.bind(this);
    this.onInviteFriends = this.onInviteFriends.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.renderCreateLeague = this.renderCreateLeague.bind(this);
    this.renderJoinLeague = this.renderJoinLeague.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState( {
      open: nextProps.open,
      isCreate: nextProps.isCreate,
    });
  }

  onDialogCancel() {
    this.setState({open: false});
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

  onCreateLeague() {
    this.setState({waitingToServer: true});
    var self=this;
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/lg/create/' + this.state.newLeagueName;
    axios.get(url)
    .then(function (response) {
      let rc = '' + response.data;
      console.log("rc = " + rc +", " + rc.startsWith("error"));
      if (rc.startsWith('error')) {
        self.setState({waitingToServer: false, newLeagueError: rc, newLeagueCode:''});
      } else {
        self.setState({waitingToServer: false, newLeagueCode: rc, newLeagueError: ''});
      }
    })
    .catch(function (error) {
      console.log(error);
      self.setState({waitingToServer: false, newLeagueError: error, newLeagueCode:''});
    });
  }

  renderCreateLeague() {
    let isCode = this.state.newLeagueCode.length > 0;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isCode ? "Invite friends..." : "Create a league"}
        primary={true}
        keyboardFocused={true}
        onClick={isCode ? this.onInviteFriends : this.onCreateLeague}
      />,
    ];

    return (
      <Dialog
        title="Leagues"
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
          hintText="League name"
        /><br />
        <TextField
          disabled={true}
          hintText="League Code"
          value={(isCode ? 'Created! Code = ' + this.state.newLeagueCode : '')}
        /><br />
      </div>
      </Dialog>
    );
  }

  renderJoinLeague() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label="Join league"
        primary={true}
        keyboardFocused={true}
        onClick={this.onJoinLeague}
      />,
    ];

    return (
      <Dialog
        title="Leagues"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
      >
      <div>
        <TextField
          disabled={false}
          hintText="League Code"
          value={this.state.enteredCode}
          errorText={this.state.joinLeagueError}
          onChange={this.onCodeUpdated}
        /><br />
        <TextField
          value={this.state.newLeagueName}
          disabled={true}
          hintText="League name"
        /><br />
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
