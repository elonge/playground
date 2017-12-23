import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import GameResultItem from './game_result_item.jsx';
import PredictionsTitle from './predictions_title.jsx';
import LoadingScreen from './loading_screen.jsx';
import UsersLeague from './users_league.jsx'

const supportThreeOptionsWinner = true;

class TodayPredictions extends React.Component {
  constructor(props) {
    try {
      super(props);
      this.renderPrediction = this.renderPrediction.bind(this);
      this.handleDialogOpen = this.handleDialogOpen.bind(this);
      this.onNextDayClick = this.onNextDayClick.bind(this);
      this.onPrevDayClick = this.onPrevDayClick.bind(this);
      this.isPrevDay = this.isPrevDay.bind(this);
      this.isNextDay = this.isNextDay.bind(this);
      this.onUsersToggle = this.onUsersToggle.bind(this);
      this.state = {
        showPointsMode : false,
        viewedDateIndex: 0,
        userPredictions: props.userPredictions,
        dialogOpen: false,
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
      <GameResultItem
        {...prediction}
        onToggleClick={() => this.onToggleClick(prediction)}
        handleDialogOpen={() => this.handleDialogOpen()}
      />
    );
  }

  handleDialogOpen() {
    this.setState({dialogOpen: true});
  };

  handleDialogClose() {
    this.setState({dialogOpen: false});
  };

  onToggleClick(prediction) {
    const userPredictions = this.state.userPredictions.slice();
    var pIndx = userPredictions.findIndex(i => (i.game_id === prediction.game_id && i.id === prediction.id));
    if (this.isThreeOptionsWinner(prediction) || this.isMultipleOptions(prediction)) {
      switch (prediction.value) {
        case null:
          userPredictions[pIndx].value = '1';
          break;
        case '1':
          userPredictions[pIndx].value = 'x';
          break;
        case 'x':
          userPredictions[pIndx].value = '2';
          break;
        case '2':
          userPredictions[pIndx].value = '1';
          break;
        default:
          userPredictions[pIndx].value = '1';
          break;
      }
    } else {
      userPredictions[pIndx].value = (userPredictions[pIndx].value == null ? true : !userPredictions[pIndx].value);
    }
    this.setState({userPredictions: userPredictions});
    this.props.updatePrediction(prediction);
  }

  // TODO (EGEG) - should move to some util class
  isThreeOptionsWinner(prediction) {
    if (!supportThreeOptionsWinner) {
      return false;
    }
    if (prediction.result_type == 'winner' && prediction.sport_type.toUpperCase() == 'SOCCER') {
      return true;
    }
    return false;
  }
  isMultipleOptions(prediction) {
    if (!supportThreeOptionsWinner) {
      return false;
    }
    if (prediction.result_type == 'event' && prediction.type_extra.toUpperCase() == 'NUM_GOALS') {
      return true;
    }
    return false;
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
            />
            <List id="a">
            {items}
            </List>
            <Dialog
              title="Arsenal vs Burnley"
              modal={false}
              open={dialogOpen}
              onRequestClose={() => this.handleDialogClose()}
            >
            60% think Arsneal will win
            </Dialog>
          </div>
        );
      }
    } catch (e) {
      alert('today_predictions exception ' + e.message);
    }
  }
};

TodayPredictions.PropTypes = {
};

export default TodayPredictions;
