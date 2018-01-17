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
import RenderUtils from './render/utils';


const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
};

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
    };
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
        console.log(channel + ": " + JSON.stringify(status));

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
    this.pushToRemote('superuser:all_games', {}, function(channel, response) {
      if (response.startsWith("ok: ")) {
        let allGames = JSON.parse(response.substring(4));
        allGames = allGames.filter(game => (new Date(game.start_time) >= new Date()));
        self.setState({allGames: allGames, nextEnabled:true});
      } else {
        console.error("---> " + response);
      }
    });
  }

  onApproveAddingPrediction() {
    this.pushToRemote("user:insert:prediction", {
      gameId: this.state.allGames[this.state.gameIndex].id,
      resultType: this.state.questionType.key,
      typeExtra: '',
      open: true,
      predictedScore: this.state.predictedScore,
      points: 1,
      creatorId: this.props.senderId,
    }, this.onApproveAddingPredictionResponse);
  }

  onApproveAddingPredictionResponse(channel, response) {
    console.log('response=' + response);
    if (response.startsWith("ok: ")) {
      this.setState({snackbarMessage: "Question is visible to your friends"});
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
//    this.props.handleClose();
  };

  handleNext() {
    const {stepIndex} = this.state;
    console.log(stepIndex+","+this.state.finished);
    if (stepIndex == 2) {
      this.onApproveAddingPrediction();
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

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return this.renderSelectGame();
      case 1:
        return this.renderSetQuestion();
      case 2:
        return (
          <div>
          <label style={{color:'red'}}>Your new question</label>
          <br />
          <label>{this.renderPredictionPrimaryText(this.state.gameIndex)}</label>
          <br />
          <label>{this.renderPredictionSecondaryText(this.state.gameIndex)}</label>
          </div>
        );
      default:
        return 'Something went wrong!';
    }
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
              <StepLabel>Choose Game</StepLabel>
            </Step>
            <Step>
              <StepLabel>Set Question</StepLabel>
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
            label={stepIndex === 2 ? 'Add Question' : 'Next'}
            primary={true}
            onClick={this.handleNext}
            disabled={!this.state.nextEnabled}
          />
        </CardActions>
        </Card>
        <Snackbar
          open={isSnack}
          message={snackbarMessage}
          autoHideDuration={6000}
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
