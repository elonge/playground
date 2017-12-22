import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';

import axios from 'axios';
import GameResultItem from './game_result_item';
import { RadioGroup, RadioButton } from 'react-radio-buttons';

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
        sportType : 'Soccer',
        resultType : 'winner',
        typeExtra: ' ',
        predictionOpen: true,
        startDate : new Date(),
        allGames : [],
        allPredictions : [],
        gameInPrediction: -1,
        superUserAction: 'new game',
        customPushMessage: '',
        messageType: 'new prediction',
      };
      this.handleChangeGameId = this.handleChangeGameId.bind(this);
      this.handleChangeSport = this.handleChangeSport.bind(this);
      this.handleChangeDate = this.handleChangeDate.bind(this);
      this.handlePredictedScoreChange = this.handlePredictedScoreChange.bind(this);
      this.handleChangeResultType = this.handleChangeResultType.bind(this);
      this.handleChangeTypeExtra = this.handleChangeTypeExtra.bind(this);
      this.onUpdateResult = this.onUpdateResult.bind(this);

    } catch (e) { alert('SuperUserEditor: ' + e.message); }
  }

  handleSuperUserChange = (value) => {
    this.loadAllGames();
    this.loadAllPredictions();
    this.setState({superUserAction:value});
  }
  handleMessageTypeChange = (value) => this.setState({messageType: value});
  handleChangeSport = (event, index, value) => this.setState({sportType:value});
  handleChangeCustomMessage = (event, value) => this.setState({customPushMessage:value});
  handleChangeResultType = (event, index, value) => this.setState({resultType:value});
  handleChangeTypeExtra = (event, value) => this.setState({typeExtra:value});
  handleChangePredictionOpen = (event, index, value) => this.setState({predictionOpen:value});
  handleChangeDate = (event, date) => this.setState({startDate: date});
  handlePredictedScoreChange = (event, value) => this.setState({predictedScore: value});
  handleHomeTeamChange = (event, value) => this.setState({homeTeam: value});
  handleAwayTeamChange = (event, value) => this.setState({awayTeam: value});;
  handleChangeGameId = (event, value) => this.setState({gameInPrediction: value});
  handleChangeTime = (event, date) => {
    var startDate = this.state.startDate;
    startDate.setTime(date.getTime());
    this.setState({startDate: startDate});
  }

  formatDateForServer(date) {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    var hour = '' + d.getHours();
    var minutes = '' + d.getMinutes();

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
    var self=this;
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/l/g/';
    axios.get(url)
    .then(function (response) {
      console.log(response.data[0]);
      self.setState({allGames: response.data[0]});
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  loadAllPredictions() {
    var self=this;
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/l/p/';
    axios.get(url)
    .then(function (response) {
      console.log(response.data[0]);
      self.setState({allPredictions: response.data[0]});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onUpdateResult(prediction) {
    var self=this;
    prediction.value = (prediction.value == true ? false : true);
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/u/'+prediction.game_id+'/'+prediction.id+'/'+prediction.value;
    axios.get(url)
    .then(function (response) {
      console.log(response);
      const predictions = self.state.allPredictions.slice();
      var pIndx = predictions.findIndex(i => (i.game_id === prediction.game_id && i.id === prediction.id));
      predictions[pIndx].value = prediction.value;
      self.setState({allPredictions: predictions});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onSubmitClick() {
    var self=this;
    this.setState({gameId: 'Sending'});
    let start = this.formatDateForServer(this.state.startDate);
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/g/'+this.state.homeTeam+'/'+this.state.awayTeam+'/'+this.state.sportType+'/'+start;
    axios.get(url)
    .then(function (response) {
      console.log(response);
      self.setState({gameId: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  onSubmitPredictionClick() {
    var self=this;
    this.setState({predictionId: 'Sending'});
    let gameId = this.state.allGames[this.state.gameInPrediction].id;
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/p/'+gameId+'/'+this.state.resultType+'/'+this.state.typeExtra+'/'+this.state.predictionOpen+'/'+this.state.predictedScore+'/'+1;
    axios.get(url)
    .then(function (response) {
      console.log(response);
      self.setState({predictionId: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onSubmitSendMessageClick() {
    var self=this;
    let message = (this.state.messageType == 'new predictions' ?
      newPredictionPushText : (this.state.messageType == 'new score' ? newScorePushText : this.state.customPushMessage));
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/m/'+message;
    axios.get(url)
    .then(function (response) {
      console.log(response);
      alert('Message sent!');
    })
    .catch(function (error) {
      console.log(error);
    });
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
    let allGamesMenuItems = "";
    allGamesMenuItems = this.state.allGames.map((game, index) =>
      <MenuItem value = {index} primaryText = {game.home_team + ' vs ' + game.away_team} />
    );
    let defaultGameId = (this.state.gameInPrediction >= 0 ? this.state.gameInPrediction : this.state.allGames.length - 1);
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
          <MenuItem value='winner' primaryText="Winner" />
          <MenuItem value='to_score' primaryText="To Score" />
          <MenuItem value='exact_score' primaryText="Exact Score" />
          <MenuItem value='event' primaryText="Event" />
          <MenuItem value='winner_range' primaryText="Winner by range" />
          <MenuItem value='player_double_digit' primaryText="Player double digits" />
        </SelectField><br />
        <TextField
          hintText="Extra info (first,penalty_home,penalty_away)"
          onChange = {this.handleChangeTypeExtra}
          /><br />
        <SelectField
          floatingLabelText="Prediction Open?"
          value={this.state.predictionOpen}
          onChange={this.handleChangePredictionOpen}
        >
          <MenuItem value={true} primaryText="True" />
          <MenuItem value={false} primaryText="False" />
        </SelectField><br />
        <TextField
          hintText="Predicted Score"
          onChange = {this.handlePredictedScoreChange}
        /><br />
        <TextField
          disabled={true}
          id="all_text"
          value={this.renderPredictionPrimaryText(this.state.gameInPrediction)}
          /><br />

        <RaisedButton label="Add prediction" primary={true} onClick={() => this.onSubmitPredictionClick()}/>
      </div>
    );
  }
  renderPredictionSecondaryText(predictionIndex) {
    // shortcuts..
    let home_team = (predictionIndex >= 0 ? this.state.allPredictions[predictionIndex].home_team : '');
    let away_team = (predictionIndex >= 0 ? this.state.allPredictions[predictionIndex].away_team : '');
    let start_time = (predictionIndex >= 0 ? this.state.allPredictions[predictionIndex].start_time : '');
    let prettyTime = new Date(start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return home_team + ' vs ' + away_team + ' (' + prettyTime + ')';
  }

  renderPrimaryBasketball(homeTeam, awayTeam, resultType, typeExtra, predictedScore) {
    switch (resultType) {
      case 'winner':
        if (predictedScore == "1") {
          return homeTeam + ' will win';
        } else if (predictedScore == "2") {
          return awayTeam + ' will win';
        }
        return 'ERROR!';
      case 'winner_range':

        let range = parseInt(typeExtra);
        let orMore = (range == 0 ? '' : (range > 0 ? 'or more' : 'or less'));
        range = Math.abs(range);
        if (predictedScore == "1") {
          return homeTeam + ' will win by ' + range + ' points ' + orMore;
        } else if (predictedScore == "2") {
          return awayTeam + ' will win by ' + range + ' points ' + orMore;
        }
        return ("ERROR");
      case 'to_score':
        return predictedScore + ' top scorer';
      case 'player_double_digit':
        return predictedScore + ' will score double digits';
    }
    return ("Error");
  }
  renderPrimarySoccer(homeTeam, awayTeam, resultType, typeExtra, predictedScore) {
    switch (resultType) {
      case 'winner':
        if (predictedScore == "1") {
          return homeTeam + ' will win';
        } else if (predictedScore == "2") {
          return awayTeam + ' will win';
        } else if (predictedScore.toUpperCase() == "X") {
          return  'Game will end with a draw';
        }
      case 'exact_score':
        return 'Final score will be '+ predictedScore;
      case 'to_score':
        return predictedScore + ' will score';
      case 'half_score':
        return 'First half between ' + homeTeam + ' and ' + awayTeam + ' will end exactly ' + predictedScore;
      case 'event':
        switch (typeExtra) {
          case 'penalty_home':
            return homeTeam + ' will have a penalty';
          case 'penalty_away':
            return awayTeam + ' will have a penalty';
        }
    }
    return ("Error");
  }

  renderPredictionPrimaryText(index) {
    let home_team = (index >= 0 ? this.state.allGames[index].home_team : '');
    let away_team = (index >= 0 ? this.state.allGames[index].away_team : '');
    let sport_type = (index >= 0 ? this.state.allGames[index].sport_type : '');
    let predicted_score = this.state.predictedScore;
    switch (sport_type.toUpperCase()) {
      case 'SOCCER':
        return this.renderPrimarySoccer(home_team, away_team, this.state.resultType, this.state.typeExtra, predicted_score);
      case 'BASKETBALL':
        return this.renderPrimaryBasketball(home_team, away_team, this.state.resultType, this.state.typeExtra, predicted_score);
    }
    return ("Error");
  }

  renderUpdatePredictions() {
    //this.state.allPredictions.map(prediction => prediction.value = null);
    let allPredictionsMenuItems = "";
    allPredictionsMenuItems = this.state.allPredictions.filter(p => p.prediction_updated==false).map((prediction, index) =>
      <GameResultItem
        {...prediction}
        onToggleClick={() => this.onUpdateResult(prediction)}
        forceEnable={true}
      />
    );
    return (
      <div>
        {allPredictionsMenuItems}
      </div>
    );
  }

  renderNewGame() {
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
          <MenuItem value='Soccer' primaryText="Soccer" />
          <MenuItem value='Basketball' primaryText="Basketball" />
          <MenuItem value='NFL' primaryText="NFL" />
          <MenuItem value='MLB' primaryText="MLB" />
        </SelectField>
        <DatePicker hintText="Game Start Date"
          defaultDate={this.state.startDate}
          onChange={this.handleChangeDate}
          />
        <TimePicker format="24hr" hintText="Game Start Time"
          defaultTime={this.state.startDate}
          onChange={this.handleChangeTime}
          />
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
