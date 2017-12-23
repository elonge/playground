import React from 'react';
import {List,ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CheckBox from 'material-ui-icons/CheckBox';
import HighlightOff from 'material-ui-icons/HighlightOff';
import LooksOne from 'material-ui-icons/LooksOne';
import LooksTwo from 'material-ui-icons/LooksTwo';
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank';
import Info from 'material-ui-icons/Info';
import Badge from 'material-ui/Badge';
import {red500, green500, blue500, indigo50} from 'material-ui/styles/colors';
import ExposureZero from 'material-ui-icons/ExposureZero';
import ExposurePlus1 from 'material-ui-icons/ExposurePlus1';
import ActionInfo from 'material-ui/svg-icons/action/info';
import RenderUtils from './render/utils';

const supportThreeOptionsWinner = false;

/*
 * A single list game, including controls
 */
class OnePrediction extends React.Component {
  constructor(props) {
    super(props);
    this.onPredictionClick = this.onPredictionClick.bind(this);
  }

  renderPrimaryBasketball(homeTeam, awayTeam, resultType, typeExtra, predictedScore) {
    switch (resultType) {
      case 'winner':
        if (predictedScore == "1") {
          return homeTeam + ' will win';
        } else if (predictedScore == "2") {
          return awayTeam + ' will win';
        } else {
          alert("unknown winner? " + predictedScore);
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
        } else {
          alert("unknown winner? " + predictedScore);
        }
        return ("ERROR");
      case 'to_score':
        return predictedScore + ' top scorer';
      case 'player_double_digit':
        return predictedScore + ' will score double digits';
    }
    return ("Error");
  }

  renderPrimaryText() {
    switch (this.props.prediction.sport_type.toUpperCase()) {
      case 'SOCCER':
        return RenderUtils.primaryText(this.props.prediction);
//        return this.renderPrimarySoccer(this.props.home_team, this.props.away_team, this.props.result_type, this.props.type_extra, this.props.predicted_score);
      case 'BASKETBALL':
        return ("Error");
    }
    return ("Error");
  }

  renderSecondaryText() {
    return RenderUtils.secondaryText(this.props.prediction);
  }

  renderLeftAvatar() {
    return RenderUtils.leftAvatar(this.props.prediction);
  }

  renderRightAvatar() {
    return RenderUtils.rightAvatar(this.props.prediction);
  }

  isPredictionDisabled() {
    if (this.props.forceEnable == true) {
      return false;
    }
    if (!this.props.prediction.open) {
      return true;
    }
    if (this.props.prediction.status == 'ended') {
      return true;
    }

    if (this.props.prediction.close_on_start_time && new Date() > new Date(this.props.prediction.start_time)) {
      return true;
    }

    if (this.props.points_updated) {
      return true;
    }

    return false;
  }


  renderRightIcon() {
    if (this.props.points_updated) {
      if (this.props.points_won == 1) {
        return (
          <ExposurePlus1 color={green500}/>
        );
      } else if (this.props.points_won == 0) {
        return (
          <ExposureZero color={red500} />
        );
      }
    }
    return  ("")
  }

  render() {
    try {
      let primaryText = this.renderPrimaryText();
      let secondaryText = this.renderSecondaryText();
      let lineColor = (this.isPredictionDisabled() ? indigo50 : 'white');
      return (
      <ListItem
        disabled={this.isPredictionDisabled()}
        primaryText={primaryText}
        secondaryText={secondaryText}
        leftAvatar={this.renderLeftAvatar()}
        onClick={() => this.onPredictionClick()}
        rightAvatar= {this.renderRightAvatar()}
        style={{textAlign:'left',backgroundColor: lineColor}}
      />
      );
    } catch (e) { alert('One Prediction: ' + e.message); }
  }
  onPredictionClick() {
    this.props.onToggleClick(this.props.prediction, RenderUtils.predictionOptions(this.props.prediction));
  }
};



OnePrediction.PropTypes = {
};

export default OnePrediction;
