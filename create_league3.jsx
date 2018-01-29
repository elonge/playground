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

class CreateLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newLeagueName: '',
      newLeague: null,
      newLeagueError: '',
      waitingToServer: false,
      leagues: props.leagues,
      users: props.users,
      finished: false,
      stepIndex: 0,
      nextEnabled: false,
      competitions: this.props.allCompetitions.map((competition) => competition.id),
    };
    this.onNewLeagueNameChanged = this.onNewLeagueNameChanged.bind(this);
    this.onCreateLeague = this.onCreateLeague.bind(this);
    this.onConfirmCreate = this.onConfirmCreate.bind(this);
    this.onInviteFriends = this.onInviteFriends.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onCreateLeagueServerResponse = this.onCreateLeagueServerResponse.bind(this);
    this.onConfirmCreateResponse = this.onConfirmCreateResponse.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.handleCompetitionsChange = this.handleCompetitionsChange.bind(this);
    this.renderMultiSelectCompetitions = this.renderMultiSelectCompetitions.bind(this);
    this.selectionRenderer = this.selectionRenderer.bind(this);
  }

  handleCompetitionsChange = (event, index, values) => {
    this.setState({competitions:values, nextEnabled: values.length>0});
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps: leagues=" + JSON.stringify(nextProps.leagues));
    this.setState( {
      newLeagueName: '',
      newLeague: null,
      newLeagueError: '',
      waitingToServer: false,
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
    this.props.onClose();
  };

  onNewLeagueNameChanged(event) {
    this.setState({newLeagueName: event.target.value, nextEnabled: (event.target.value.length > 2)});
  }

  onInviteFriends(index) {
    this.props.onInviteNewLeague(this.state.newLeague);
  }

  onConfirmCreate() {
    this.pushToRemote("league:confirm", {leagueId: this.state.newLeague.id, competitions:this.state.competitions}, this.onConfirmCreateResponse);
  }

  onConfirmCreateResponse(channel, response) {
    console.log(response);
    if (response.startsWith('ok')) {
      this.setState({
        newLeagueError:'',
        stepIndex: 2,
        finished: true,
        nextEnabled: true,
      });
    } else {
      this.setState({newLeagueError:response});
    }
  }

  onCreateLeague() {
    this.pushToRemote("league:insert", {leagueName: this.state.newLeagueName}, this.onCreateLeagueServerResponse);
  }

  onCreateLeagueServerResponse(channel, response) {
    if (response.startsWith("ok: ")) {
      let league = JSON.parse(response.substring(4));
      this.setState({
        newLeagueError:'',
        newLeague: league,
        stepIndex: 1,
        finished: false,
        nextEnabled: true,
      });
    } else {
      this.setState({newLeagueError:response, newLeague: null});
    }
  }

  handleNext() {
    const {stepIndex, competitions} = this.state;
    console.log(stepIndex+","+this.state.finished);
    if (stepIndex == 0) {
      this.onCreateLeague();
    } else if (stepIndex == 1) {
      this.onConfirmCreate();
    } else if (stepIndex == 2) {
      this.onInviteFriends();
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
            value={this.state.newLeagueName}
            onChange={this.onNewLeagueNameChanged}
            errorText={this.state.newLeagueError}
            floatingLabelStyle={{color: 'red'}}
            floatingLabelText ="Please enter a unique league name"
          />
        );
      case 1:
        return this.renderMultiSelectCompetitions();
      case 2:
        return (
          <p>
          <label style={{fontSize:"22px"}}>Your league was created!</label><br/><br/>
          <label style={{fontSize:"18px"}}>Code to join the league:</label>
          <label style={{fontSize:"18px", float:'right', color:'red'}}>{this.state.newLeague.league_code}</label>
          </p>
        );
      default:
        return 'Something went wrong!';
    }
  }

  selectionRenderer(values) {
      switch (values.length) {
        case 0:
          return 'No competitions';
        case 1:
            return this.props.allCompetitions.find((competition) => competition.id == values[0]).name;
        case this.props.allCompetitions.length:
          return "All competitions";
        default:
          return `${values.length} competitions selected`;
      }
    }

  renderMultiSelectCompetitions() {
    const { competitions } = this.state;
    let competitionsItems =  this.props.allCompetitions.map((competition) => (
      <MenuItem
        key={competition.id}
        checked={this.state.competitions.indexOf(competition.id) > -1}
        value={competition.id}
        leftIcon={<Icon icon={GIFT_ICONS[competition.sport]} />}
        primaryText={competition.name}
      />
    ));
    return (
      <SelectField
        multiple={true}
        floatingLabelStyle={{color: 'red'}}
        floatingLabelText="Ask only about these competitions"
        value={this.state.competitions}
        onChange={this.handleCompetitionsChange}
        fullWidth={true}
        selectionRenderer={this.selectionRenderer}
        errorText={this.state.newLeagueError}
      >
        {competitionsItems}
      </SelectField>
    );
  }

  render() {
    const {finished, stepIndex, snackbarMessage} = this.state;

    return (
      <Paper
        zDepth={4}
      >
      <Card>
        <CardHeader
          title="Create a private league to compete against your friends"
        />
      <CardText style={{padding: 0}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Name</StepLabel>
          </Step>
          <Step>
            <StepLabel>Competitions</StepLabel>
          </Step>
          <Step>
            <StepLabel>Invite</StepLabel>
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
          label={stepIndex === 2 ? 'Invite' : 'Next'}
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

CreateLeagueDialog.propTypes = {

};

export default CreateLeagueDialog;

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
