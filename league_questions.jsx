import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Step, Stepper,StepLabel} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RenderUtils from './render/utils';


const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
};

let shareLastQuestion;
let lastNewQuestionInfo;

class LeagueQuestionsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      finished: false,
      stepIndex: 0,
      waitingToServer: false,
      allGames : [],
      gameIndex: 0,
      questionType : null,
      predictedScore: '',
      nextEnabled: false,
      snackbarMessage: null,
      shareAllLeagues: true,
    };
    this.handleSaveShare = this.handleSaveShare.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.handleChangeGame = this.handleChangeGame.bind(this);
    this.renderSelectGame = this.renderSelectGame.bind(this);
    this.loadAllGames = this.loadAllGames.bind(this);
    this.handleChangeQuestionType = this.handleChangeQuestionType.bind(this);
    this.handlePredictedScoreChange = this.handlePredictedScoreChange.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onApproveAddingPrediction = this.onApproveAddingPrediction.bind(this);
    this.onApproveAddingPredictionResponse = this.onApproveAddingPredictionResponse.bind(this);
    this.onSnackBarDone = this.onSnackBarDone.bind(this);
    this.onAddMoreQuestion = this.onAddMoreQuestion.bind(this);
    this.renderLastStep = this.renderLastStep.bind(this);
  }

  handleChangeGame = (event, value) => this.setState({gameIndex: value, nextEnabled:true});
  handleChangeQuestionType = (event, index, value) => this.setState({questionType:value, nextEnabled:(value.extraInfoDescription == null)});
  handlePredictedScoreChange = (event, value) => this.setState({predictedScore: value, nextEnabled:(value != '')});

  componentWillReceiveProps(nextProps) {
    if (nextProps.open == this.state.open) {
      // outside changes should not effect dialog (unless dialog is opened/close or change question)
      //this.setState({leagues: nextProps.leagues});
      return;
    }
    this.setState({open:nextProps.open});
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
        this.setState({
          waitingToServer:false,
        });

        statusHandler(channel, status);
      }
    );
  }

  componentWillMount() {
    this.loadAllGames();
  }

  loadAllGames() {
    var self = this;
    this.pushToRemote('game:latest', {}, function(channel, response) {
      if (response.startsWith("ok: ")) {
        let allGames = JSON.parse(response.substring(4));
        allGames = allGames.filter(game => (new Date(game.start_time) >= new Date()));
        self.setState({allGames: allGames, nextEnabled:true});
      } else {
        console.error("---> " + response);
      }
    });
  }

  onApproveAddingPrediction(toShare) {
    shareLastQuestion = toShare;
    lastNewQuestionInfo = new Object();
    lastNewQuestionInfo.home_team = this.state.allGames[this.state.gameIndex].home_team;
    lastNewQuestionInfo.away_team = this.state.allGames[this.state.gameIndex].away_team;
    let forLeagueIds = [];
    // Shouldn't happen:  adding a quetion should be diabled if user doesn't have any private league
    if (this.state.shareAllLeagues)  {
      forLeagueIds = this.props.leagues.filter(league => league.id > 1).map(league => league.id);
    } else if (this.props.currentLeague.id > 1) {
      forLeagueIds = [this.props.currentLeague.id];
    }

    this.pushToRemote("user:insert:prediction", {
      gameId: this.state.allGames[this.state.gameIndex].id,
      resultType: this.state.questionType.key,
      typeExtra: '',
      open: true,
      predictedScore: this.state.predictedScore,
      points: 1,
      creatorId: this.props.senderId,
      forLeagueIds: forLeagueIds,
    }, this.onApproveAddingPredictionResponse);
  }

  onApproveAddingPredictionResponse(channel, response) {
    console.log('response=' + response);
    if (response.startsWith("ok: ")) {
      this.setState({snackbarMessage: "Question added!"});
      this.props.onNewQuestion(shareLastQuestion, lastNewQuestionInfo);
    } else {
      console.error("---> " + response);
    }
  }

  onSnackBarDone(reason) {
    if (this.state.snackbarMessage == null) {
      // Something already stopped this snackbar. No need to close dialog
      return;
    }
    this.setState({snackbarMessage: null, stepIndex:0, open: false});
  }

  onAddMoreQuestion(event) {
    this.setState({finished:false, stepIndex:0,questionType:null, predictedScore:'', snackbarMessage:null});
  }

  onDialogCancel() {
    this.setState({open: false, stepIndex:0});
    this.props.handleClose();
  };

  handleSaveShare() {
    this.onApproveAddingPrediction(true);
  }

  handleNext() {
    const {stepIndex} = this.state;
    console.log(stepIndex+","+this.state.finished);
    if (stepIndex == 2) {
      this.onApproveAddingPrediction(false);
    } else {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      });
    }
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  updateCheck() {
    this.setState((oldState) => {
      return {
        shareAllLeagues: !oldState.shareAllLeagues,
      };
    });
  }


  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return this.renderSelectGame();
      case 1:
        return this.renderSetQuestion();
      case 2:
        return this.renderLastStep();
      default:
        return 'Something went wrong!';
    }
  }

  renderLastStep() {
    let checkboxElement;
    if (this.props.leagues.length > 2) {
      checkboxElement = (
        <Checkbox
          label={this.state.shareAllLeagues ? "Visible to all your leagues" : "Visible to " + this.props.currentLeague.league_name + " only"}
          checked={this.state.shareAllLeagues}
          onCheck={this.updateCheck.bind(this)}
          disabled={this.props.currentLeague.id == 1}
        />
      );
    }
    return (
      <div>
      <label style={{fontSize:"18px", color: 'rgba(0, 0, 0, 0.87)'}}>Your new question</label><br/>
      <br />
      <label style={{color: 'rgba(0, 0, 0, 0.87)'}}>{this.renderPredictionPrimaryText(this.state.gameIndex)}</label>
      <br />
      <label style={{color: 'rgba(0, 0, 0, 0.87)'}}>{this.renderPredictionSecondaryText(this.state.gameIndex)}</label><br/><br/>
      {checkboxElement}
      </div>
    );
  }

  renderSelectGame() {
    if (this.state.allGames.length == 0) {
      return;
    }
    let allGamesMenuItems = "";
    allGamesMenuItems = this.state.allGames.map((game, index) =>
      <MenuItem key={index} value = {index} primaryText = {game.home_team + ' vs ' + game.away_team} />
    );
    return (
      <SelectField
        floatingLabelText="Select the game you want to ask a question on"
        value={this.state.gameIndex}
        onChange={this.handleChangeGame}
        fullWidth={true}
        floatingLabelStyle={{color: 'red'}}
      >
      {allGamesMenuItems}
      </SelectField>
    );
  }

  renderSetQuestion() {
    let currentSport =  this.state.allGames[this.state.gameIndex].sport_type;
    let possibleResultTypes = this.findSupportedResulTypes(currentSport).map((result, index) =>
      <MenuItem value={result} primaryText={result.name} key={result.key} />
    );
    let defaultGameId = (this.state.gameInPrediction >= 0 ? this.state.gameInPrediction : this.state.allGames.length - 1);
    let currentQuestionType = this.state.questionType;
    if (this.state.questionType == null) {
      currentQuestionType = this.findSupportedResulTypes(currentSport)[0];
      this.setState({questionType: currentQuestionType});
    }

    let extraInfo = (currentQuestionType.extraInfoDescription == null ? "" :
      <TextField
        hintText={currentQuestionType.extraInfoDescription}
        hintStyle={{color: 'red'}}
        value={this.state.predictedScore}
        onChange = {this.handlePredictedScoreChange}
      />
    );

    return (
      <div>
        <SelectField
          floatingLabelText="Question Type"
          floatingLabelStyle={{color: 'red'}}
          value={currentQuestionType}
          onChange={this.handleChangeQuestionType}
        >
        {possibleResultTypes}
        </SelectField>
        <br />
        {extraInfo}
        <br />
      </div>
    );
  }

  renderPredictionPrimaryText(index) {
    if (this.state.questionType == null) {
      return "";
    }
    return RenderUtils.primaryText(this.createTempPrediction(index), false);
  }

  renderPredictionSecondaryText(index) {
    if (this.state.questionType == null) {
      return "";
    }
    return RenderUtils.secondaryText(this.createTempPrediction(index), false);
  }

  createTempPrediction(index) {
    let tempPrediction = new Object();
    tempPrediction.home_team = (index >= 0 ? this.state.allGames[index].home_team : '');
    tempPrediction.away_team = (index >= 0 ? this.state.allGames[index].away_team : '');
    tempPrediction.sport_type = (index >= 0 ? this.state.allGames[index].sport_type : '');
    tempPrediction.predicted_score = this.state.predictedScore;
    tempPrediction.result_type = this.state.questionType.key;
    tempPrediction.start_time = (index >= 0 ? this.state.allGames[index].start_time : '');
    tempPrediction.value = null;
    tempPrediction.points = 1;

    console.log("--->" + JSON.stringify(tempPrediction));
    return tempPrediction;
  }

  findSupportedResulTypes(sportType) {
    console.log("sportType="+sportType);
    return RenderUtils.supportedResultTypes.filter(result => (result.sport.toUpperCase() == sportType.toUpperCase()));
  }

  render() {
    const {finished, stepIndex, questionType, snackbarMessage} = this.state;
    let isSnack = snackbarMessage != null;

    let shareButton = stepIndex < 2 ? "" : (
      <RaisedButton
        label={'Save & Share'}
        primary={true}
        onClick={this.handleSaveShare}
        disabled={!this.state.nextEnabled}
      />
    );

    return (
      <Dialog
        title="Add more questions"
        repositionOnUpdate = {false}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
        autoDetectWindowHeight={false}
        contentStyle={{width: '100%', transform: 'translate(0, 0)'}}
        bodyStyle={{padding: 0}}
        style={{paddingTop: 0, height: '100vh'}}
      >
        <Card>
        <CardHeader style={{padding: 0}}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Game</StepLabel>
            </Step>
            <Step>
              <StepLabel>Question</StepLabel>
            </Step>
            <Step>
              <StepLabel>Save & Share </StepLabel>
            </Step>
          </Stepper>
        </CardHeader>
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
          <RaisedButton
            label={stepIndex === 2 ? 'Save' : 'Next'}
            primary={true}
            onClick={this.handleNext}
            disabled={!this.state.nextEnabled}
          />
          {shareButton}
        </CardActions>
        </Card>
        <Snackbar
          open={isSnack}
          message={snackbarMessage == null ? "" : snackbarMessage}
          autoHideDuration={4500}
          onRequestClose={this.onSnackBarDone}
          action="Add more"
          onActionClick={this.onAddMoreQuestion}
        />
      </Dialog>
    );
  }
}

LeagueQuestionsDialog.propTypes = {

};

export default LeagueQuestionsDialog;
