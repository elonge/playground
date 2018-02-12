import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import ContentSend from 'material-ui/svg-icons/content/send';
import Paper from 'material-ui/Paper';

const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
};

const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginBottom: 16,
    marginLeft: 10,
    paddingRight: 20,
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
};


class EditSettingDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      waitingToServer: false,
    };
    this.onSaveSettings = this.onSaveSettings.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onSaveSettingsResponse = this.onSaveSettingsResponse.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.handleTogglePoints = this.handleTogglePoints.bind(this);
    this.handleToggleQuestions = this.handleToggleQuestions.bind(this);
    this.handleToggleReminders = this.handleToggleReminders.bind(this);
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

  handleTogglePoints = (event, toggle) => {
    let copySettings = JSON.parse(JSON.stringify(this.state.settings));
    copySettings.notifyPoints = toggle;
    this.setState({settings: copySettings});
  };

  handleToggleQuestions = (event, toggle) => {
    let copySettings = JSON.parse(JSON.stringify(this.state.settings));
    copySettings.notifyQuestions = toggle;
    this.setState({settings: copySettings});
  };

  handleToggleReminders = (event, toggle) => {
    let copySettings = JSON.parse(JSON.stringify(this.state.settings));
    copySettings.notifyReminders = toggle;
    this.setState({settings: copySettings});
  };

  onDialogCancel() {
    this.props.onClose();
  };

  onSaveSettings() {
    this.pushToRemote("user:uptate_settings", {settings: this.state.settings}, this.onSaveSettingsResponse);
  }

  onSaveSettingsResponse(channel, response) {
    console.log("onSaveSettingsResponse: " + response);
    if (response.startsWith("ok: ")) {
      console.log("Save was successful")
      this.props.onSettingsUpdate(JSON.parse(response.substring(4)));
    }
  }

  renderSettings() {
    const { settings } = this.state;
    return (
      <div>
      <br/>
      <Toggle
        toggled={this.state.settings.notifyPoints}
        onToggle={this.handleTogglePoints}
        label="Notify me about my points"
        defaultToggled={true}
        style={styles.toggle}
      />
      <Toggle
        toggled={this.state.settings.notifyQuestions}
        onToggle={this.handleToggleQuestions}
        label="Notify me about new questions"
        defaultToggled={true}
        style={styles.toggle}
      />
      <Toggle
        toggled={this.state.settings.notifyReminders}
        onToggle={this.handleToggleReminders}
        label="Remind me if I haven't predicted"
        defaultToggled={true}
        style={styles.toggle}
      />
      </div>
    );
  }

  render() {
    return (
      <Paper
        zDepth={4}
      >
      <Card>
        <CardHeader
          title="Notifications Settings"
          titleColor='rgb(0,188,212)'
          titleStyle={{fontSize:'20px'}}
        />
      <CardText style={{padding: 0}}>
        {this.renderSettings()}
      </CardText>
      <CardActions style={{paddingBottom: 30}}>
        <FlatButton
          label='Save'
          primary={true}
          disabled={this.state.waitingToServer}
          onClick={this.onSaveSettings}
        />
        <FlatButton
          style={{float:'right'}}
          label="Cancel"
          primary={true}
          disabled = {false}
          onClick={this.onDialogCancel}
        />
      </CardActions>
      </Card>
      </Paper>
    );
  }
}

EditSettingDialog.propTypes = {

};

export default EditSettingDialog;
