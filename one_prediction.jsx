import React from 'react';
import {List,ListItem} from 'material-ui/List';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
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

/*
 * A single list game, including controls
 */
class OnePrediction extends React.Component {
  constructor(props) {
    super(props);
    this.onPredictionClick = this.onPredictionClick.bind(this);
  }

  renderPrimaryText() {
    return RenderUtils.primaryText(this.props.prediction, this.isHidePrediction());
  }

  renderSecondaryText() {
    return RenderUtils.secondaryText(this.props.prediction, this.isHidePrediction());
  }

  renderLeftAvatar() {
    return RenderUtils.leftAvatar(this.props.prediction, this.isHidePrediction());
  }

  renderRightAvatar() {
    return RenderUtils.rightAvatar(this.props.prediction, this.isHidePrediction());
  }

  isHidePrediction() {
    if (this.props.otherUserMode && this.props.prediction.open && new Date() <= new Date(this.props.prediction.start_time)) {
      return true;
    }
    return false;
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

  render() {
    const prediction = this.props.prediction;
    let primaryText = this.renderPrimaryText();
    let thirdRow = prediction.points + " point" + (prediction.points == 1 ? "" : "s");
    if (prediction.creator_id > 0) {
      const creator = this.props.users.find((user) => user.fbId === prediction.creator_id);
      thirdRow += ". Question by " + creator.name;
    }
    let lineColor = (this.isPredictionDisabled() ? '#F1F8E9' : '#FAFAFA');
    let secondaryText = (
      <p>
        <span style={{color: darkBlack}}>{this.renderSecondaryText()}</span> <br/>
        {thirdRow}
      </p>
    );

    return (
      <ListItem
        disabled={this.props.otherUserMode}
        primaryText={primaryText}
        secondaryText={secondaryText}
        secondaryTextLines={2}
        leftAvatar={this.renderLeftAvatar()}
        onClick={() => this.onPredictionClick()}
        rightAvatar= {this.renderRightAvatar()}
        style={{textAlign:'left',backgroundColor: lineColor}}
      />
    );
  }

  onPredictionClick() {
    this.props.onPredictionClick(this.props.prediction, RenderUtils.predictionOptions(this.props.prediction), RenderUtils.predictionTitle(this.props.prediction));
  }
};

OnePrediction.propTypes = {
};

export default OnePrediction;
