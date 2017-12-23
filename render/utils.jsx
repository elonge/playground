import React from 'react';
import {red500, green500, blue500, indigo50} from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import CheckBox from 'material-ui-icons/CheckBox';
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank';
import Avatar from 'material-ui/Avatar';
import Soccer from './soccer';

var supportedResultTypes = Soccer.supportedResultTypes;

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

    typeRender.nullPrimary = typeRender.nullPrimaryDefine
      .replace('_HOME', prediction.home_team)
      .replace('_AWAY', prediction.away_team)
      .replace('_VALUE', prediction.value)
      .replace('_PREDICT', prediction.predicted_score);

    return typeRender;
}

const predictionOptions = (prediction) => {
  var tIndx = supportedResultTypes.findIndex(i => (i.key === prediction.result_type));
  if (tIndx < 0) {
    console.log('cannot find renderer for resultType=' + prediction.result_type);
    return [];
  }
  return replaceVars(prediction, supportedResultTypes[tIndx]).options;
}

const primaryText = (prediction) => {
  var tIndx = supportedResultTypes.findIndex(i => (i.key === prediction.result_type));
  if (tIndx < 0) {
    console.log('cannot find renderer for resultType=' + prediction.result_type);
    return 'ERROR ('+prediction.result_type+')';
  }
  if (prediction.value == null) {
    return replaceVars(prediction, supportedResultTypes[tIndx]).nullPrimary;
  }
  return replaceVars(prediction, supportedResultTypes[tIndx]).primary;
}

const secondaryText = (prediction) => {
  let prettyTime = new Date(prediction.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return prediction.home_team + ' vs ' + prediction.away_team + ' (' + prettyTime + ')';
}

const leftAvatar = (prediction) => {
  if (prediction.value == null) {
    return (
        <Avatar
          icon={<CheckBoxOutlineBlank/>}
          backgroundColor={indigo50}
        />
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

const rightAvatar = (prediction) => {
  if (prediction.value == null) {
    return (
        <Avatar
          icon={<ActionInfo/>}
          backgroundColor={indigo50}
        />
    );
  }  else {
    var tIndx = supportedResultTypes.findIndex(i => (i.key === prediction.result_type));
    if (tIndx < 0) {
      console.log('cannot find renderer for resultType=' + prediction.result_type);
      return 'ERROR ('+prediction.result_type+')';
    }
    return replaceVars(prediction, supportedResultTypes[tIndx]).rightAvatar(prediction);
  }
}

export default {
  primaryText,
  secondaryText,
  rightAvatar,
  leftAvatar,
  predictionOptions,
}
