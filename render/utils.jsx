import React from 'react';
import {red500, green500, blue500, indigo50, indigo100} from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionLock from 'material-ui/svg-icons/action/lock';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import CheckBox from 'material-ui-icons/CheckBox';
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Soccer from './soccer';
import Basketball from './basketball'
import Football from './football';

const leftAvatarStyle = {'font-size': '12px', textAlign: 'center'};

var supportedResultTypes = Soccer.supportedResultTypes.concat(Basketball.supportedResultTypes).concat(Football.supportedResultTypes);

const replaceVars = (prediction, typeRender) => {
  typeRender.options = typeRender.optionsDefine.map((option) =>
    option.replace('_HOME', prediction.home_team)
    .replace('_AWAY', prediction.away_team)
    .replace('_PREDICT', prediction.predicted_score)
    .replace('_VALUE', prediction.value));

    typeRender.primary = typeRender.primaryDefine
      .replace('_HOME', prediction.home_team)
      .replace('_AWAY', prediction.away_team)
      .replace('_VALUE', prediction.value)
      .replace('_PREDICT', prediction.predicted_score);

    if (typeof typeRender.secondaryDefine != 'undefined') {
      typeRender.secondary = typeRender.secondaryDefine
        .replace('_HOME', prediction.home_team)
        .replace('_AWAY', prediction.away_team)
        .replace('_VALUE', prediction.value)
        .replace('_STARTTIME', new Date(prediction.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))
        .replace('_PREDICT', prediction.predicted_score);
    }
    typeRender.nullPrimary = typeRender.nullPrimaryDefine
      .replace('_HOME', prediction.home_team)
      .replace('_AWAY', prediction.away_team)
      .replace('_VALUE', prediction.value)
      .replace('_PREDICT', prediction.predicted_score);

    return typeRender;
}

// Also compare sport
const predictionOptions = (prediction) => {
  var tIndx = getResultTypeIndex(prediction);
  if (tIndx < 0) {
    console.log('cannot find renderer for resultType=' + prediction.result_type);
    return [];
  }
  return replaceVars(prediction, supportedResultTypes[tIndx]).options;
}

const primaryText = (prediction, hideUserPrediction) => {
  var tIndx = getResultTypeIndex(prediction);
  if (tIndx < 0) {
    console.log('cannot find renderer for resultType=' + prediction.sport_type+'::'+prediction.result_type );
    return 'ERROR ('+prediction.result_type + ':' + prediction.sport_type;
  }
  if (prediction.value == null || hideUserPrediction) {
    return replaceVars(prediction, supportedResultTypes[tIndx]).nullPrimary;
  }
  return replaceVars(prediction, supportedResultTypes[tIndx]).primary;
}

const secondaryText = (prediction, hideUserPrediction) => {
  var tIndx = getResultTypeIndex(prediction);
  if (tIndx < 0) {
    console.log('cannot find renderer for resultType=' + prediction.sport_type+'::'+prediction.result_type );
  }
  if (typeof supportedResultTypes[tIndx].secondaryDefine != 'undefined') {
    return replaceVars(prediction, supportedResultTypes[tIndx]).secondary;
  }

  let prettyTime = new Date(prediction.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return prediction.home_team + ' vs ' + prediction.away_team + ' (' + prettyTime + ')';
}

const leftAvatar = (prediction, hideUserPrediction) => {
  if (prediction.value == null) {
    return (
        <Avatar
          style={leftAvatarStyle}
          backgroundColor={indigo100}
          > {prediction.points + (prediction.points > 1 ? " pts" : " pt")}
          </Avatar>
    );
  } else if (prediction.points_updated) {
    return (
        <Avatar
          backgroundColor={prediction.points_won == 0 ? red500 : green500}
        >
        {prediction.points_won}
        </Avatar>
    );
  } else {
    return (
        <Avatar
          icon={<CheckBox/>}
          backgroundColor={green500}
        />
      );
    }
}

const rightAvatar = (prediction, hideUserPrediction) => {
  if (prediction.value == null) {
    return '';
    /*
    return (
        <Avatar
          icon={<ModeEdit/>}
        />
    );
    */
  } else if (hideUserPrediction) {
    return (
        <Avatar
          icon={<ActionLock/>}
          backgroundColor={green500}
        />
    );
  } else {
    var tIndx = getResultTypeIndex(prediction);
    if (tIndx < 0) {
      console.log('cannot find renderer for resultType=' + prediction.result_type);
      return 'ERROR ('+prediction.result_type + ':' + prediction.sport_type;
    }
    return replaceVars(prediction, supportedResultTypes[tIndx]).rightAvatar(prediction);
  }
}

const getResultTypeIndex = (prediction) => {
  return supportedResultTypes.findIndex(i => (i.key === prediction.result_type && i.sport.toUpperCase() == prediction.sport_type.toUpperCase()));
}

export default {
  primaryText,
  secondaryText,
  rightAvatar,
  leftAvatar,
  predictionOptions,
  supportedResultTypes
}
