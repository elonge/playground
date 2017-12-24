import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import GameResultItem from './game_result_item.jsx';
import PredictionsTitle from './predictions_title.jsx';
import LoadingScreen from './loading_screen.jsx';
import UsersLeague from './users_league.jsx'
import OnePrediction from './one_prediction.jsx';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';

const supportThreeOptionsWinner = false;

class TodayPredictions extends React.Component {
  constructor(props) {
    try {
      super(props);
      this.renderPrediction = this.renderPrediction.bind(this);
      this.onNextDayClick = this.onNextDayClick.bind(this);
      this.onPrevDayClick = this.onPrevDayClick.bind(this);
      this.isPrevDay = this.isPrevDay.bind(this);
      this.isNextDay = this.isNextDay.bind(this);
      this.onUsersToggle = this.onUsersToggle.bind(this);
      this.handleMakePrediction = this.handleMakePrediction.bind(this);
      this.onToggleClick = this.onToggleClick.bind(this);
      this.state = {
        showPointsMode : false,
        viewedDateIndex: 0,
        userPredictions: props.userPredictions,
        dialogOpen: false,
        dialogPrediction: null,
        dialogPredictionOptions: [],
        days: props.userPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
      };
    } catch (e) { alert('Today exception: ' + e.message); }
  }

  onNextDayClick() {
    let viewedDateIndex = this.state.viewedDateIndex;
    if (viewedDateIndex > 0) {
      this.setState({viewedDateIndex: viewedDateIndex - 1});
    }
  }

  onPrevDayClick() {
    let viewedDateIndex = this.state.viewedDateIndex;
    if (viewedDateIndex < this.state.days.length - 1) {
      this.setState({viewedDateIndex: viewedDateIndex + 1});
    }
  }

  isNextDay() {
    return (this.state.viewedDateIndex > 0);
  }

  isPrevDay() {
    return (this.state.viewedDateIndex < this.state.days.length - 1);
  }

  onUsersToggle() {
    let current = this.state.showPointsMode;
    this.setState({showPointsMode: !current});
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
        prediction={prediction}
        forceEnable={this.props.forceEnable}
        onToggleClick={this.onToggleClick}
      />
    );
  }

  handleDialogClose() {
    this.setState({dialogOpen: false});
  };

  onToggleClick(prediction, options) {
    this.setState({dialogPrediction: prediction, dialogOpen: true, dialogPredictionOptions: options});
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
      <MenuItem primaryText = {option} />
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

  render() {
    try {
      const {
        showPointsMode,
        viewedDateIndex,
        userPredictions,
        dialogOpen,
        days
      } = this.state;

      let viewedDateStr = this.formatDateAsDB(days[viewedDateIndex]);
      if (userPredictions == null) {
        return (
          <LoadingScreen key='load' />
        );
      }
      let dayPredictions = userPredictions.filter(prediction => prediction.prediction_date == viewedDateStr);

      if (dayPredictions.length == 0)  {
        return (
          <LoadingScreen key='load' />
        );
      } else {
        let items;
        let currentPredictionSelectField;
        if (showPointsMode) {
          items = (
            <UsersLeague
              usersPoints={this.props.usersPoints}
            />
          );
        } else {
          items = dayPredictions.map((prediction) =>
            this.renderPrediction(prediction)
          );
          currentPredictionSelectField = this.renderPredictionsMenu();
        }
        return (
          <div>
            <PredictionsTitle
              viewedDate = {days[viewedDateIndex]}
              onNextDayClick = {this.onNextDayClick}
              onPrevDayClick = {this.onPrevDayClick}
              isPrevDay = {this.isPrevDay}
              isNextDay = {this.isNextDay}
              onUsersToggle = {this.onUsersToggle}
              showDaysController = {!showPointsMode}
            />
            <List id="a">
            {items}
            </List>
            <Dialog
              title="Make your Prediction:"
              modal={false}
              open={dialogOpen}
              onRequestClose={() => this.handleDialogClose()}
            >
            {currentPredictionSelectField}
            </Dialog>
          </div>
        );
      }
    } catch (e) {
      alert('today_predictions exception ' + e.message);
    }
  }

  OLD_onToggleClick(prediction) {
    const userPredictions = this.state.userPredictions.slice();
    var pIndx = userPredictions.findIndex(i => (i.game_id === prediction.game_id && i.id === prediction.id));
    userPredictions[pIndx].value = (userPredictions[pIndx].value == null ? true : !userPredictions[pIndx].value);
    this.setState({userPredictions: userPredictions});
    this.props.updatePrediction(prediction);
  }

};

TodayPredictions.PropTypes = {
};

export default TodayPredictions;
