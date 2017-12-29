import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import GameResultItem from './game_result_item.jsx';
import PredictionsTitle from './predictions_title.jsx';
import LoadingScreen from './loading_screen.jsx';
import OnePrediction from './one_prediction.jsx';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import Subheader from 'material-ui/Subheader';

const supportThreeOptionsWinner = false;

class TodayPredictions extends React.Component {
  constructor(props) {
    super(props);
    this.renderPrediction = this.renderPrediction.bind(this);
    this.handleMakePrediction = this.handleMakePrediction.bind(this);
    this.onPredictionClick = this.onPredictionClick.bind(this);
    this.state = {
      viewedDateIndex: props.viewedDateIndex,
      otherUserMode: props.otherUserMode,
      userPredictions: props.userPredictions,
      dialogOpen: false,
      dialogPrediction: null,
      dialogPredictionOptions: [],
      days: props.userPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse()
    };
  }

  // Called when switching to new viewed user
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
        prediction={prediction}
        forceEnable={this.props.forceEnable}
        onPredictionClick={this.onPredictionClick}
        otherUserMode={(this.state.otherUserMode != null)}
      />
    );
  }

  handleDialogClose() {
    this.setState({dialogOpen: false});
  };

  onPredictionClick(prediction, options) {
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


  render() {
    try {
      const {
        viewedDateIndex,
        userPredictions,
        dialogOpen,
        days
      } = this.state;

      let viewedDateStr = this.formatDateAsDB(days[viewedDateIndex]);
      if (userPredictions == null) {
        return (
          <label>Debug1</label>
//          <LoadingScreen key='load' />
        );
      }
      let dayPredictions = userPredictions.filter(prediction => prediction.prediction_date == viewedDateStr);

      if (dayPredictions.length == 0)  {
        return (
          <label>Debug2</label>
        );
      } else {
        let title = 'Your predictions';
        if (this.state.otherUserMode != null) {
          title = this.state.otherUserMode.name + "'s predictions";
        }
        title = title + " for " + this.renderPrettyDate(days[viewedDateIndex]);

        let currentPredictionSelectField;
        let items = dayPredictions.map((prediction) =>
          this.renderPrediction(prediction)
        );

        currentPredictionSelectField = this.renderPredictionsMenu();
        return (
          <div>
            <Subheader>{title}</Subheader>
            <List id="a" style={{backgroundColor: '#FAFAFA'}}>
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
};

TodayPredictions.propTypes = {
};

export default TodayPredictions;
