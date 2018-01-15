import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import PredictionsTitle from './predictions_title.jsx';
import LoadingScreen from './loading_screen.jsx';
import OnePrediction from './one_prediction.jsx';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import Subheader from 'material-ui/Subheader';
import RenderUtils from './render/utils';

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
    this.state = {
      viewedDateIndex: props.viewedDateIndex,
      otherUserMode: props.otherUserMode,
      userPredictions: props.userPredictions,
      dialogOpen: false,
      dialogPrediction: null,
      dialogPredictionOptions: [],
      dialogPredictionTitle: null,
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
          </List>
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
  }
};

TodayPredictions.propTypes = {
};

export default TodayPredictions;
