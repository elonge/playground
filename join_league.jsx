import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Step, Stepper,StepLabel} from 'material-ui/Stepper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ContentSend from 'material-ui/svg-icons/content/send';
import {Icon, GIFT_ICONS} from './my_icons.jsx';
import Paper from 'material-ui/Paper';

const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
};

class JoinLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredCode: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      users: props.users,
      finished: false,
      stepIndex: 0,
      nextEnabled: false,
    };
    this.onCodeUpdated = this.onCodeUpdated.bind(this);
    this.onGetLeagueByCode = this.onGetLeagueByCode.bind(this);
    this.onApproveJoining = this.onApproveJoining.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onGetLeagueServerResponse = this.onGetLeagueServerResponse.bind(this);
    this.onJoinLeagueServerResponse = this.onJoinLeagueServerResponse.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.selectionRenderer = this.selectionRenderer.bind(this);
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
    this.props.onClose();
  };

  onCodeUpdated(event) {
    this.setState({enteredCode: event.target.value, nextEnabled:event.target.value.length > 5});
  }

  onApproveJoining() {
    this.pushToRemote("league:join", {leagueId: this.state.joinLeague.id}, this.onJoinLeagueServerResponse);
  }

  onJoinLeagueServerResponse(channel, response) {
    console.log("OnJoin approve: " + response);
    if (response.startsWith("ok")) {
      this.props.onNewLeague(this.state.joinLeague);
      this.setState({stepIndex:0, finished:false});
    } else {
      this.setState({joinLeagueError:response, joinLeague: null, nextEnabled:false});
    }
  }

  onGetLeagueByCode() {
    this.pushToRemote("league:by_code", {leagueCode: this.state.enteredCode}, this.onGetLeagueServerResponse);
  }

  onGetLeagueServerResponse(channel, response) {
    if (response.startsWith("ok: ")) {
      let league = JSON.parse(response.substring(4));
      this.setState({joinLeagueError:'', joinLeague: league, stepIndex:1, finished:true});
    } else {
      this.setState({joinLeagueError:response, joinLeague: null, nextEnabled:false});
    }
  }

  handleNext() {
    const {stepIndex, competitions} = this.state;
    console.log(stepIndex+","+this.state.finished);
    if (stepIndex == 0) {
      this.onGetLeagueByCode();
    } else {
      this.onApproveJoining();
    }
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <TextField
            value={this.state.enteredCode}
            onChange={this.onCodeUpdated}
            errorText={this.state.joinLeagueError}
            floatingLabelStyle={{color: 'red'}}
            floatingLabelText ="Enter the code to join the league"
          />
        );
      case 1:
        if (this.state.joinLeagueError.length > 0) {
          return (
            <p>
            <label style={{fontSize:"16px", color:'red'}}>{this.state.joinLeagueError}</label>
            </p>
          );
        }

        return (
          <p>
          <label style={{fontSize:"22px"}}>{this.state.joinLeague.league_name}</label><br/><br/>
          <label style={{fontSize:"16px", color:'#3F51B5'}}>{'Questions about: ' + this.selectionRenderer(this.state.joinLeague.competitions)}</label>
          </p>
        );
      default:
        return 'Something went wrong!';
    }
  }

  selectionRenderer(values) {
    if (values.length == 0) {
      return 'No competitions';
    } else if (values.length == 1) {
      return this.props.allCompetitions.find((competition) => competition.id == values[0]).name;
    } else if (values.length == this.props.allCompetitions.length) {
      return "All competitions";
    } else {
      let first=this.props.allCompetitions.find((competition) => competition.id == values[0]).name;
      let second=this.props.allCompetitions.find((competition) => competition.id == values[1]).name;
      if (values.length == 2) {
        return first+" and "+second;
      } else if (values.length == 3) {
        let third=this.props.allCompetitions.find((competition) => competition.id == values[2]).name;
        return first+", "+second + " and " + third;
      } else {
        return first+", "+second + " and " + (values.length-2) + " other competitions";
      }
    }
  }

  render() {
    const {finished, stepIndex} = this.state;

    return (
      <Paper
        zDepth={4}
      >
      <Card>
        <CardHeader
          title="Join a private league to compete against your friends"
        />
      <CardText style={{padding: 0}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>League Code</StepLabel>
          </Step>
          <Step>
            <StepLabel>Join the League</StepLabel>
          </Step>
        </Stepper>
      </CardText>
      <CardText>
        {this.getStepContent(stepIndex)}
      </CardText>
      <CardActions style={{paddingBottom: 30}}>
        <FlatButton
          label="Back"
          disabled={stepIndex === 0}
          onClick={this.handlePrev}
          style={{marginRight: 12}}
        />
        <FlatButton
          label={stepIndex === 1 ? 'Join' : 'Next'}
          primary={true}
          onClick={this.handleNext}
          disabled={!this.state.nextEnabled}
          icon={stepIndex == 2 ? <ContentSend/> : ""}
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

JoinLeagueDialog.propTypes = {

};

export default JoinLeagueDialog;

/**
<Paper
  title="New Private League"
  repositionOnUpdate = {false}
  actions={actions}
  disabled={this.state.waitingToServer}
  modal={false}
  open={this.state.open}
  onRequestClose={this.onDialogCancel}
  contentStyle={{width: '100%', transform: 'translate(0, 0)'}}
  bodyStyle={{padding: 0}}
  style={{paddingTop: 0, height: '100vh'}}
  autoScrollBodyContent={true}
  repositionOnUpdate={false}
  zDepth={4}
>
**/
