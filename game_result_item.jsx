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

const supportThreeOptionsWinner = false;

/*
 * A single list game, including controls
 */
class GameResultItem extends React.Component {
  constructor(props) {
    super(props);
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

  renderPrimaryThreeOptionsWinner() {
    switch (this.props.value) {
      case null:
        return 'Pick your winner';
        break;
      case '1':
        return this.props.home_team + ' will win';
        break;
      case 'x':
        return  'Game will end with a draw';
        break;
      case '2':
        return this.props.away_team + ' will win';
        break;
      default:
        return 'ERROR ('+this.props.value+')';
        break;
    }
  }

  renderPrimarySoccer(homeTeam, awayTeam, resultType, typeExtra, predictedScore) {
    if (this.isThreeOptionsWinner()) {
      return this.renderPrimaryThreeOptionsWinner();
    }
    switch (resultType) {
      case 'winner':
        if (predictedScore == "1") {
          return homeTeam + ' will win';
        } else if (predictedScore == "2") {
          return awayTeam + ' will win';
        } else if (predictedScore.toUpperCase() == "X") {
          return  'Game will end with a draw';
        } else {
          alert("unknown winner? " + predictedScore);
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
    return ("Error ("+resultType+")");
  }

  renderPrimaryText() {
    switch (this.props.sport_type.toUpperCase()) {
      case 'SOCCER':
        return this.renderPrimarySoccer(this.props.home_team, this.props.away_team, this.props.result_type, this.props.type_extra, this.props.predicted_score);
      case 'BASKETBALL':
        return this.renderPrimaryBasketball(this.props.home_team, this.props.away_team, this.props.result_type, this.props.type_extra, this.props.predicted_score);
    }
    return ("Error");
  }

  renderSecondaryText() {
    // shortcuts..
    let home_team = this.props.home_team;
    let away_team = this.props.away_team;
    let start_time = this.props.start_time;
    let prettyTime = new Date(start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return home_team + ' vs ' + away_team + ' (' + prettyTime + ')';
  }

  renderSoccerWinnerAvatar() {
    let value = this.props.value;
    if (value == null) {
      return (
          <Avatar
            icon={<CheckBoxOutlineBlank/>}
            backgroundColor={indigo50}
          />
      );
    } else if (value == '1') {
      return (
          <Avatar
            icon={<LooksOne/>}
            backgroundColor={green500}
          />
        );
    } else if (value == '2') {
      return (
          <Avatar
            icon={<LooksTwo/>}
            backgroundColor={red500}
          />
        );
    } else {
      return (
          <Avatar
            icon={<HighlightOff/>}
            backgroundColor={blue500}
          />
      );
    }
  }

  isThreeOptionsWinner() {
    if (!supportThreeOptionsWinner) {
      return false;
    }
    if (this.props.result_type == 'winner' && this.props.sport_type.toUpperCase() == 'SOCCER') {
      return true;
    }
    return false;
  }

  renderAvatar() {
    if (this.isThreeOptionsWinner()) {
      return this.renderSoccerWinnerAvatar();
    }
    let value = this.props.value;
    if (value == null) {
      return (
          <Avatar
            icon={<CheckBoxOutlineBlank/>}
            backgroundColor={indigo50}
          />
      );
    } else if (value) {
      return (
          <Avatar
            icon={<CheckBox/>}
            backgroundColor={green500}
          />
        );
    } else {
      return (
          <Avatar
            icon={<CheckBoxOutlineBlank/>}
            backgroundColor={red500}
          />
      );
    }
  }

  isPredictionDisabled() {
    if (this.props.forceEnable == true) {
      return false;
    }
    if (!this.props.open) {
      return true;
    }
    if (this.props.status == 'ended') {
      return true;
    }

    if (this.props.close_on_start_time && new Date() > new Date(this.props.start_time)) {
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
        leftAvatar={this.renderAvatar()}
        onClick={() => this.props.onToggleClick()}
        rightIcon= {this.renderRightIcon()}
        style={{textAlign:'left',backgroundColor: lineColor}}
      />
      );
    } catch (e) { alert('gameResultItem: ' + e.message); }
  }
};


GameResultItem.PropTypes = {
};

export default GameResultItem;
