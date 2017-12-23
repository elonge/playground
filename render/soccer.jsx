import React from 'react';
import {red500, green500, blue500, indigo50} from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import CheckBox from 'material-ui-icons/CheckBox';
import CheckBoxOutlineBlank from 'material-ui-icons/CheckBoxOutlineBlank';
import Avatar from 'material-ui/Avatar';

var winner = {
  key: 'winner',
  optionsDefine: ['_HOME', 'Draw', '_AWAY'],
  nullPrimaryDefine: 'Pick your winner',
  primaryDefine: 'Your winner: _VALUE',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

var toScore = {
  key: 'to_score',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: '_PREDICT will score?',
  primaryDefine: '_PREDICT will score?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

var firstScore = {
  key: 'first_score',
  optionsDefine: ['_HOME', '_AWAY', 'None'],
  nullPrimaryDefine: 'Which team will score first?',
  primaryDefine: '_VALUE will score first',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

var numGoals = {
  key: 'num_goals',
  optionsDefine: ['0','1','2','3','4','5','6','7','8+'],
  nullPrimaryDefine: 'How many goals?',
  primaryDefine: 'Number of total goals is _VALUE',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

var homePenalty = {
  key: 'home_penalty',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: '_HOME will have a penalty?',
  primaryDefine: '_HOME will have a penalty?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

var awayPenalty = {
  key: 'away_penalty',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: '_AWAY will have a penalty?',
  primaryDefine: '_AWAY will have a penalty?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

/*** Backward compatability ***/
var gameEvent = {
  key: 'event',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: '_HOME will have a penalty?',
  primaryDefine: '_HOME will have a penalty?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

var exactScore = {
  key: 'exact_score',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: 'Exact score will be _PREDICT',
  primaryDefine: 'Exact score will be _PREDICT',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}


var supportedResultTypes = [winner, toScore, firstScore, numGoals, homePenalty, awayPenalty, exactScore, gameEvent ];

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
  supportedResultTypes,
}
