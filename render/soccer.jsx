import React from 'react';
import Avatar from 'material-ui/Avatar';

var winner = {
  sport: 'soccer',
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
  sport: 'soccer',
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
  sport: 'soccer',
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
  sport: 'soccer',
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
  sport: 'soccer',
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
  sport: 'soccer',
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
  sport: 'soccer',
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
  sport: 'soccer',
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

export default {
  supportedResultTypes,
}
