import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
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

class EditLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league: props.league,
      waitingToServer: false,
      newCompetitions: props.league.competitions,
      errorText: '',
    };
    this.onSaveNewCompetitions = this.onSaveNewCompetitions.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onSaveNewCompetitionsServerResponse = this.onSaveNewCompetitionsServerResponse.bind(this);
    this.competitionsRenderer = this.competitionsRenderer.bind(this);
    this.renderMultiSelectCompetitions = this.renderMultiSelectCompetitions.bind(this);
    this.handleCompetitionsChange = this.handleCompetitionsChange.bind(this);
  }

  handleCompetitionsChange = (event, index, values) => {
    this.setState({newCompetitions:values});
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

  onSaveNewCompetitions() {
    this.pushToRemote("league:replace", {leagueId: this.state.league.id, competitions:this.state.newCompetitions}, this.onSaveNewCompetitionsServerResponse);
  }

  onSaveNewCompetitionsServerResponse(channel, response) {
    if (response.startsWith("ok")) {
      let league = this.state.league;
      league.competitions = this.state.newCompetitions;
      this.props.onCompetitionsUpdate(league);
    } else {
      this.setState({errorText:response});
    }
  }

  competitionsRenderer(values) {
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

  renderMultiSelectCompetitions() {
    const { newCompetitions, errorText } = this.state;
    let competitionsItems =  this.props.allCompetitions.map((competition) => (
      <MenuItem
        key={competition.id}
        checked={newCompetitions.indexOf(competition.id) > -1}
        value={competition.id}
        leftIcon={<Icon icon={GIFT_ICONS[competition.sport]} />}
        primaryText={competition.name}
      />
    ));
    return (
      <SelectField
        multiple={true}
        value={newCompetitions}
        onChange={this.handleCompetitionsChange}
        fullWidth={true}
        selectionRenderer={this.competitionsRenderer}
        errorText={newCompetitions.length == 0 ? "At least one competition should be checked" : errorText}
        style={{marginLeft:'16px'}}
      >
        {competitionsItems}
      </SelectField>
    );
  }

  render() {
    return (
      <Paper
        zDepth={4}
      >
      <Card>
        <CardHeader
          title="Edit the competitions your league is tracking"
        />
      <CardText style={{padding: 0}}>
        {this.renderMultiSelectCompetitions()}
      </CardText>
      <CardActions style={{paddingBottom: 30}}>
        <FlatButton
          label='Save'
          primary={true}
          onClick={this.onSaveNewCompetitions}
          disabled={this.state.newCompetitions.length == 0}
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

EditLeagueDialog.propTypes = {

};

export default EditLeagueDialog;

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
