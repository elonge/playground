import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';

import { RadioGroup, RadioButton } from 'react-radio-buttons';
import TodayPredictions from './today_predictions.jsx'
import RenderUtils from './render/utils';

const newPredictionPushText = "Check out 5 new questions about today\'s games";
const newScorePushText = "Scores were updated. Check your position!";

class SuperUserEditor extends React.Component {
  constructor(props) {
    try {
      super(props);
      this.state = {
        gameId: 'GameId (readonly)',
        predictionId: 'predictionId (readonly)',
        homeTeam: '',
        awayTeam: '',
        predictedScore: '',
        sportType : 'soccer',
        resultType : 'winner',
        typeExtra: ' ',
        predictionOpen: true,
        startDate : new Date(),
        allGames : [],
        allPredictions : [],
        gameInPrediction: 0,
        superUserAction: 'new game',
        customPushMessage: '',
        messageType: 'new prediction',
        waitingToServer: false,
        jsonGames: null,
        points: 1,
      };
      this.handleChangeGameId = this.handleChangeGameId.bind(this);
      this.handleChangeSport = this.handleChangeSport.bind(this);
      this.handleChangeDate = this.handleChangeDate.bind(this);
      this.handlePredictedScoreChange = this.handlePredictedScoreChange.bind(this);
      this.handleChangeResultType = this.handleChangeResultType.bind(this);
      this.handleChangeTypeExtra = this.handleChangeTypeExtra.bind(this);
      this.handleChangePoints = this.handleChangePoints.bind(this);
      this.onUpdateResult = this.onUpdateResult.bind(this);
      this.renderNewPrediction = this.renderNewPrediction.bind(this);
      this.pushToRemote = this.pushToRemote.bind(this);
      this.handleJSONPatch  = this.handleJSONPatch.bind(this);
      this.insertManyGames = this.insertManyGames.bind(this);
    } catch (e) { alert('SuperUserEditor: ' + e.message); }
  }

  pushToRemote(channel, message, statusHandler) {
    console.log("pushToRemote: " + channel +"; senderId=" + this.props.senderId);
    this.setState({waitingToServer: true});

    this.props.socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.senderId,
        ...message,
      },
      (status) => {
        this.setState({
          waitingToServer:false,
        });

        statusHandler(channel, status);
      }
    );
  }

  handleSuperUserChange = (value) => {
    this.loadAllGames();
    this.loadAllPredictions();
    let gameInPrediction = (this.state.gameInPrediction <0 ? this.state.allGames.length-1 : this.state.gameInPrediction);
    this.setState({superUserAction:value, gameInPrediction:gameInPrediction});
  }
  handleMessageTypeChange = (value) => this.setState({messageType: value});
  handleChangeSport = (event, index, value) => this.setState({sportType:value});
  handleChangeCustomMessage = (event, value) => this.setState({customPushMessage:value});
  handleChangeResultType = (event, index, value) => this.setState({resultType:value});
  handleChangeTypeExtra = (event, value) => this.setState({typeExtra:value});
  handleChangePoints = (event, value) => this.setState({points:value});
  handleChangePredictionOpen = (event, index, value) => this.setState({predictionOpen:value});
  handleChangeDate = (event, date) => this.setState({startDate: date});
  handlePredictedScoreChange = (event, value) => this.setState({predictedScore: value});
  handleHomeTeamChange = (event, value) => this.setState({homeTeam: value});
  handleAwayTeamChange = (event, value) => this.setState({awayTeam: value});
  handleJSONPatch = (event, value) => this.setState({jsonGames: value});
  handleChangeGameId = (event, value) => this.setState({gameInPrediction: value});
  handleChangeTime = (event, date) => {
    var startDate = new Date(this.state.startDate);
    startDate.setHours(date.getHours());
    startDate.setMinutes(date.getMinutes());
    startDate.setSeconds(date.getSeconds());
    this.setState({startDate: startDate});
  }

  formatDateForServer(date) {
    var d = new Date(date);
    var month = '' + (d.getUTCMonth() + 1);
    var day = '' + d.getUTCDate();
    var year = d.getUTCFullYear();
    var hour = '' + d.getUTCHours();
    var minutes = '' + d.getUTCMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minutes.length < 2) minutes = '0' + minutes;
    return [year, month, day].join('-') + ' ' + [hour, minutes].join(':');
  }

  componentDidMount() {
    this.loadAllGames();
    this.loadAllPredictions();
  }

  loadAllGames() {
    var self = this;
    this.pushToRemote('superuser:all_games', {}, function(channel, response) {
      if (response.startsWith("ok: ")) {
        let allGames = JSON.parse(response.substring(4));
        allGames = allGames.filter(game => (new Date(game.start_time) >= new Date()));
        self.setState({allGames: allGames});
      } else {
        console.error("---> " + response);
      }
    });
  }

  loadAllPredictions() {
    var self=this;
    this.pushToRemote('superuser:all_predictions', {}, function(channel, response) {
      if (response.startsWith("ok: ")) {
        let allPredictions = JSON.parse(response.substring(4));
        self.setState({allPredictions: allPredictions});
      } else {
        console.error("---> " + response);
      }
    });
  }

  onSubmitClick() {
    var self=this;
    this.setState({gameId: 'Sending'});
    if (this.state.jsonGames != null) {
      this.insertManyGames(JSON.parse(this.state.jsonGames));
      return;
    }

    let start = this.formatDateForServer(this.state.startDate);
    this.pushToRemote('superuser:game', {
      homeTeam: self.state.homeTeam,
      awayTeam: self.state.awayTeam,
      sportType: self.state.sportType,
      startTime: start,
    }, function(channel, response) {
      if (response.startsWith("ok: ")) {
        self.setState({gameId: response.substring(4), jsonGames:null});
      } else {
        console.error("---> " + response);
      }
    });
  }

  insertManyGames(games) {
    var self=this;
    games.forEach(function(game) {
      let start = self.formatDateForServer(game.time);
      self.pushToRemote('superuser:game', {
        homeTeam: game.home,
        awayTeam: game.away,
        sportType: game.sportType,
        startTime: start,
      }, function(channel, response) {
        if (response.startsWith("ok: ")) {
          self.setState({gameId: response.substring(4), jsonGames:null});
        } else {
          console.error("---> " + response);
        }
      });
    });
  }

  onSubmitPredictionClick() {
    var self=this;
    this.setState({predictionId: 'Sending'});
    let gameId = this.state.allGames[this.state.gameInPrediction].id;
    this.pushToRemote('superuser:prediction', {
      gameId: gameId,
      resultType: self.state.resultType,
      typeExtra: self.state.typeExtra,
      open: self.state.predictionOpen,
      predictedScore: self.state.predictedScore,
      points: 1,
      creatorId:0,
    }, function(channel, response) {
      if (response.startsWith("ok: ")) {
        self.setState({predictionId: response.substring(4)});
      } else {
        console.error("---> " + response);
      }
    });
  }

  onUpdateResult(prediction) {
    var self=this;
    this.pushToRemote('superuser:result', {
      id: prediction.id,
      gameId: prediction.game_id,
      value: prediction.value,
    }, function(channel, response) {
        console.log("---> " + response);
    });
  }

  onSubmitSendMessageClick() {
    var self=this;
    let message = (this.state.messageType == 'new predictions' ?
      newPredictionPushText : (this.state.messageType == 'new score' ? newScorePushText : this.state.customPushMessage));

    if (this.state.messageType == 'stats') {
      this.pushToRemote('superuser:stats', {},
      function(channel, response) {
       alert('Stats were build!');
       console.log("---> " + response);
       return;
     });
    } else {
      this.pushToRemote('superuser:push', {
        message: message,
      },
       function(channel, response) {
        alert('Message sent!');
        console.log("---> " + response);
      });
    }
  }


  findSupportedSportTypes() {
    console.log(RenderUtils.supportedResultTypes);
    return RenderUtils.supportedResultTypes.map(result => result.sport).filter(function(item, pos){
      return RenderUtils.supportedResultTypes.map(result => result.sport).indexOf(item)== pos;
    });
  }

  findSupportedResulTypes(sportType) {
    console.log("sportType="+sportType);
    return RenderUtils.supportedResultTypes.filter(result => (result.sport.toUpperCase() == sportType.toUpperCase())).map(result => result.key);
  }

  onToggleClick(prediction, options) {
    this.setState({dialogPrediction: prediction, dialogOpen: true, dialogPredictionOptions: options});
  }

  handleMakePrediction(event, index, value) {
    const userPredictions = this.state.userPredictions.slice();
    const prediction = this.state.dialogPrediction;
    var pIndx = userPredictions.findIndex(i => (i.game_id === prediction.game_id && i.id === prediction.id));
    userPredictions[pIndx].value = this.state.dialogPredictionOptions[index];
    this.setState({userPredictions: userPredictions, dialogOpen:false});
    this.onUpdateResult(userPredictions[pIndx]);
  }

  renderPushMessage() {
    return (
      <div>
        <RadioGroup value = {this.state.messageType} onChange={ this.handleMessageTypeChange}>
          <RadioButton value="new predictions">
            {newPredictionPushText}
          </RadioButton>
          <RadioButton value="new score">
            {newScorePushText}
          </RadioButton>
          <RadioButton value="stats">
            Just build stats (no message)
          </RadioButton>
          <RadioButton value="custom">
            [Type your own]
          </RadioButton>
        </RadioGroup>
        <br />
        <TextField disabled={(this.state.messageType != 'custom')}
          value={this.state.customPushMessage}
          onChange={this.handleChangeCustomMessage}
        /><br />
        <RaisedButton label="Send push message!" primary={true} onClick={() => this.onSubmitSendMessageClick()}/>
        </div>
    );
  }

  renderNewPrediction() {
    if (this.state.allGames.length == 0) {
      return;
    }
    let allGamesMenuItems = "";
    allGamesMenuItems = this.state.allGames.map((game, index) =>
      <MenuItem key={index} value = {index} primaryText = {game.home_team + ' vs ' + game.away_team} />
    );
    let defaultGameId = (this.state.gameInPrediction >= 0 ? this.state.gameInPrediction : this.state.allGames.length - 1);
    console.log(defaultGameId + ":" + JSON.stringify(this.state.allGames[defaultGameId]));
    let currentSport =  this.state.allGames[defaultGameId].sport_type;
    console.log(this.findSupportedResulTypes(currentSport));
    let possibleResultTypes = this.findSupportedResulTypes(currentSport).map((result, index) =>
      <MenuItem value={result} primaryText={result} />
    );
    console.log(possibleResultTypes);
    return (
      <div>
      <TextField
        disabled={true}
        id="prediction_id"
        value={this.state.predictionId}
        /><br />
        <SelectField
          floatingLabelText="Game Id"
          value={defaultGameId}
          onChange={this.handleChangeGameId}
        >
        {allGamesMenuItems}
        </SelectField><br />
        <SelectField
          floatingLabelText="Result Type"
          value={this.state.resultType}
          onChange={this.handleChangeResultType}
        >
        {possibleResultTypes}
        </SelectField><br />
        {/*
        <TextField
          hintText="Extra info (first,penalty_home,penalty_away)"
          onChange = {this.handleChangeTypeExtra}
          /><br />
        */}
        <TextField
          floatingLabelText="Predicted Player/Score"
          hintText="e.g. Steph Curry"
          onChange = {this.handlePredictedScoreChange}
        /><br />
        <TextField
          hintText="Points"
          floatingLabelText="Points"
          value={this.state.points}
          onChange={this.handleChangePoints}
        /><br />
        <TextField
          disabled={true}
          id="all_text"
          value={this.renderPredictionPrimaryText(this.state.gameInPrediction)}
          /><br />
          <TextField
            disabled={true}
            id="all_text2"
            value={this.renderPredictionSecondaryText(this.state.gameInPrediction)}
            /><br />

        <RaisedButton label="Add prediction" primary={true} onClick={() => this.onSubmitPredictionClick()}/>
      </div>
    );
  }

  createTempPrediction(index) {
    let tempPrediction = new Object();
    tempPrediction.home_team = (index >= 0 ? this.state.allGames[index].home_team : '');
    tempPrediction.away_team = (index >= 0 ? this.state.allGames[index].away_team : '');
    tempPrediction.sport_type = (index >= 0 ? this.state.allGames[index].sport_type : '');
    tempPrediction.predicted_score = this.state.predictedScore;
    tempPrediction.result_type = this.state.resultType;
    tempPrediction.type_extra = this.state.typeExtra;
    tempPrediction.start_time = (index >= 0 ? this.state.allGames[index].start_type : '');
    tempPrediction.value = null;
    tempPrediction.points = 1;

    console.log("--->" + JSON.stringify(tempPrediction));
    return tempPrediction;
  }

  renderPredictionSecondaryText(predictionIndex) {
    return RenderUtils.secondaryText(this.createTempPrediction(predictionIndex), false);
  }

  renderPredictionPrimaryText(index) {
    return RenderUtils.primaryText(this.createTempPrediction(index), false);
  }

  renderUpdatePredictions() {
    //this.state.allPredictions.map(prediction => prediction.value = null);
    let myPredictions = this.state.allPredictions.filter(p => p.prediction_updated==false);
    return (
      <div>
        <TodayPredictions
          userPredictions={myPredictions}
          updatePrediction={this.onUpdateResult}
          forceEnable={true}
          otherUserMode={null}
          viewedDateIndex={0}
          users={[]}
          otherPredictions={[]}
          socket={this.props.socket}
          senderId={this.props.senderId}
          />
      </div>
    );
  }

  renderNewGame() {
    console.log("sport types: " + this.findSupportedSportTypes());
    let sportItems = this.findSupportedSportTypes().map((sport, index) =>
      <MenuItem key={index} value = {sport} primaryText = {sport} />
    );

    return (
      <div>
      <TextField
        disabled={true}
        id="game_id"
        value={this.state.gameId}
        /><br />
        <TextField
          hintText="Home Team"
          onChange = {this.handleHomeTeamChange}
        /><br />
        <br />
        <TextField
          hintText="Away Team"
          onChange = {this.handleAwayTeamChange}
        /><br />
        <SelectField
          floatingLabelText="Sport Type"
          value={this.state.sportType}
          onChange={this.handleChangeSport}
        >
        {sportItems}
        </SelectField>
        <DatePicker hintText="Game Start Date"
          defaultDate={this.state.startDate}
          onChange={this.handleChangeDate}
          />
        <TimePicker format="24hr" hintText="Game Start Time"
          defaultTime={this.state.startDate}
          onChange={this.handleChangeTime}
          />
          <TextField
            hintText="JSON!"
            value={this.state.jsonGames == null ? '' : this.state.jsonGames}
            multiLine={true}
            rows={2}
            rowsMax={10}
            onChange = {this.handleJSONPatch}
          /><br />
        <RaisedButton label="Add Game" primary={true} onClick={() => this.onSubmitClick()}/>
      </div>
    );
  }
  render() {
    let chooseAction = (
    <RadioGroup value = {this.state.superUserAction} onChange={ this.handleSuperUserChange } horizontal>
      <RadioButton value="new game">
        Add new games
      </RadioButton>
      <RadioButton value="new prediction">
        Add new predictions
      </RadioButton>
      <RadioButton value="update score">
        Update prediction score
      </RadioButton>
      <RadioButton value="send message">
        Send push message
      </RadioButton>
    </RadioGroup>
    );
    let action;
    switch (this.state.superUserAction) {
      case 'new game':
        action = this.renderNewGame();
        break;
      case 'new prediction':
          action = this.renderNewPrediction();
          break;
        case 'update score':
          action = this.renderUpdatePredictions();
          break;
        case 'send message':
          action = this.renderPushMessage();
          break;
      default:
    }
    return (
      <div>
        <Subheader>Super User Mode! Think before submitting!!!</Subheader>
        <br />
        {chooseAction}
        <br />
        {action}
      </div>
    );
  }
}
export default SuperUserEditor;
