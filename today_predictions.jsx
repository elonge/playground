import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import AddIcon from 'material-ui/svg-icons/content/add';

import PredictionsTitle from './predictions_title.jsx';
import LoadingScreen from './loading_screen.jsx';
import OnePrediction from './one_prediction.jsx';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import Subheader from 'material-ui/Subheader';
import RenderUtils from './render/utils';
import LeagueQuestionsDialog from './league_questions.jsx';

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
};


class TodayPredictions extends React.Component {
  constructor(props) {
    super(props);
    this.renderPrediction = this.renderPrediction.bind(this);
    this.handleMakePrediction = this.handleMakePrediction.bind(this);
    this.onPredictionClick = this.onPredictionClick.bind(this);
    this.renderOtherUsersPredictions = this.renderOtherUsersPredictions.bind(this);
    this.isShowOtherPredictions = this.isShowOtherPredictions.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.onNewQuestionClick = this.onNewQuestionClick.bind(this);
    this.onNewQuestion = this.onNewQuestion.bind(this);
    this.onDialogQuestionClose = this.onDialogQuestionClose.bind(this);
    this.state = {
      viewedDateIndex: props.viewedDateIndex,
      otherUserMode: props.otherUserMode,
      userPredictions: props.userPredictions,
      dialogOpen: false,
      dialogPrediction: null,
      dialogPredictionOptions: [],
      dialogPredictionTitle: null,
      questionDialogOpen: false,
      days: props.userPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
    };
  }

  // Called when switching to new viewed user or moving date
  componentWillReceiveProps(nextProps) {
    this.setState( {
      viewedDateIndex: nextProps.viewedDateIndex,
      otherUserMode: nextProps.otherUserMode,
      userPredictions: nextProps.userPredictions,
      days: nextProps.userPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
    });
  }

  formatDateAsDB(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  renderPrediction(prediction) {
    return (
      <OnePrediction
        key={''+prediction.game_id + '.'+prediction.id}
        prediction={prediction}
        forceEnable={this.props.forceEnable}
        onPredictionClick={this.onPredictionClick}
        otherUserMode={(this.state.otherUserMode != null)}
        users={this.props.users}
      />
    );
  }

  handleDialogClose() {
    this.setState({dialogOpen: false});
  };

  onPredictionClick(prediction, options, title) {
    this.setState({
      dialogPrediction: prediction,
      dialogOpen: true,
      dialogPredictionOptions: options,
      dialogPredictionTitle: title,
    });
  }

  handleMakePrediction(event, index, value) {
    const userPredictions = this.state.userPredictions.slice();
    const prediction = this.state.dialogPrediction;
    var pIndx = userPredictions.findIndex(i => (i.game_id === prediction.game_id && i.id === prediction.id));
    userPredictions[pIndx].value = this.state.dialogPredictionOptions[index];
    this.setState({userPredictions: userPredictions, dialogOpen:false});
    this.props.updatePrediction(userPredictions[pIndx]);
  }

  renderPredictionsMenu() {
    let menuItems = this.state.dialogPredictionOptions.map((option) =>
      <MenuItem primaryText = {option} key={option}/>
    );
    return (
      <DropDownMenu
        onChange={this.handleMakePrediction}
        openImmediately={true}
        value={0}
      >
      {menuItems}
      </DropDownMenu>
    );
  }

  renderOtherUsersPredictions() {
    let otherUsersPredictions = this.props.otherPredictions.filter((prediction) =>
      (prediction.id == this.state.dialogPrediction.id &&
        prediction.game_id == this.state.dialogPrediction.game_id &&
        prediction.prediction_date == this.state.days[this.state.viewedDateIndex]));

    let listItems = otherUsersPredictions.map((prediction) => {
      console.log("prediction=" + JSON.stringify(prediction));
      const user = this.props.users.find((user) => user.fbId == prediction.user_id);
      return (
        <ListItem
          disabled={true}
          leftAvatar={RenderUtils.leftAvatar(prediction, false)}
          primaryText={user.name}
          secondaryText={prediction.value == null ? "No prediction" : prediction.value}
          key={user.fbId}
          style={{textAlign:'left'}}
        />
      );
    });

    console.log(listItems);

    return (
      <Card>
      <CardText>
      <List>
        {listItems}
      </List>
      </CardText>
      <CardActions>
        <FlatButton label="Cancel" onClick={this.handleDialogClose} />
      </CardActions>
      </Card>
    );
  }

  renderPrettyDate(d1) {
    var strDate = new Date(d1).toLocaleDateString();
    var today = new Date();
    if (today.toLocaleDateString() == strDate) {
      return "today";
    }
    var yesterday = new Date(today.setDate(today.getDate() - 1));
    if (yesterday.toLocaleDateString() == strDate) {
      return "yesterday";
    }
    return strDate;
  }

  isShowOtherPredictions() {
    if (this.props.forceEnable) {
      return false;
    }
    if (this.state.dialogPrediction == null) {
      return false;
    }
    if (!this.state.dialogPrediction.open) {
      return true;
    }

    if (this.state.dialogPrediction.status == 'ended') {
      return true;
    }

    if (this.state.dialogPrediction.close_on_start_time && new Date() > new Date(this.state.dialogPrediction.start_time)) {
      return true;
    }
    return false;
  }

  onNewQuestion(toShare, questionInfo) {
    console.log("toShare=" + toShare);
    this.props.onNewQuestion(toShare, questionInfo);
  }

  onNewQuestionClick() {
    console.log("onNewQuestionClick");
    this.setState({questionDialogOpen:true});
  }

  onDialogQuestionClose() {
    this.setState({questionDialogOpen:false})
  }

  render() {
    const {
      viewedDateIndex,
      userPredictions,
      dialogOpen,
      days,
      dialogPredictionTitle
    } = this.state;

    let viewedDateStr = this.formatDateAsDB(days[viewedDateIndex]);
    if (userPredictions == null) {
      return (
        <label>Debug1</label>
//          <LoadingScreen key='load' />
      );
    }
    let questionsDialog = (
      <LeagueQuestionsDialog
        open={this.state.questionDialogOpen}
        socket={this.props.socket}
        senderId={this.props.senderId}
        onNewQuestion={this.onNewQuestion}
        leagues={this.props.leagues}
        currentLeague={this.props.currentLeague}
        handleClose={this.onDialogQuestionClose}
      />
    );

    let dayPredictions = userPredictions.filter(prediction => prediction.prediction_date == viewedDateStr);
    let title;
    if (dayPredictions.length == 0)  {
      title = "No questions on " +  this.props.currentLeague.league_name;
    } else {
      title = 'Your predictions';
      if (this.state.otherUserMode != null) {
        title = this.state.otherUserMode.name + "'s predictions";
      }
      title = title + " for " + this.renderPrettyDate(days[viewedDateIndex]);
    }
    let items = dayPredictions.map((prediction) =>
      this.renderPrediction(prediction)
    );

    let currentPredictionSelectField;
    let dialogTitle="";
    if (this.isShowOtherPredictions()) {
      currentPredictionSelectField = this.renderOtherUsersPredictions();
      dialogTitle = "What other predicted";
    } else {
      currentPredictionSelectField = this.renderPredictionsMenu();
      if (dialogPredictionTitle != null) {
        dialogTitle = dialogPredictionTitle;
      }
    }
    return (
      <div>
        <Subheader>{title}</Subheader>
        <List key="a" style={{backgroundColor: '#FAFAFA'}}>
        {items}
        <ListItem
          leftAvatar={<Avatar icon={<AddIcon />} />}
          primaryText="Add a new question"
          secondaryText={this.props.leagues.length > 1 ? "Only visible in your private leagues" : "You need to set up a private league first"}
          disabled={this.props.leagues.length == 1}
          onClick={this.onNewQuestionClick}
        />
        </List>
        {questionsDialog}
        <Dialog
          title={dialogTitle}
          modal={false}
          open={dialogOpen}
          onRequestClose={() => this.handleDialogClose()}
          contentStyle={customContentStyle}
          autoScrollBodyContent={true}
        >
        {currentPredictionSelectField}
        </Dialog>
      </div>
    );
  }
};

TodayPredictions.propTypes = {
};

export default TodayPredictions;
