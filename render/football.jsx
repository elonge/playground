import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {margin: 5, textAlign: 'center'};

var winner = {
  sport: 'Football',
  key: 'winner',
  optionsDefine: ['_HOME', '_AWAY'],
  nullPrimaryDefine: 'Pick your winner',
  primaryDefine: 'Your winner: _VALUE',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : '2');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

var winnerRange = {
  sport: 'Football',
  key: 'winner_range',
  optionsDefine: ['_HOME by 7 points or more', '_HOME by less than 7 points','_AWAY by 7 points or more','_AWAY by less than 7 points'],
  nullPrimaryDefine: 'Pick your winner',
  primaryDefine: '_VALUE',
  rightAvatar: function(prediction) {
    let shortValue;
    let shortTeam = prediction.value.substring(0, 2);
    shortValue = (prediction.value.indexOf('more') < 0 ? shortTeam + ' 7-' : shortTeam + ' 7+');
    return (
        <Avatar
          style={style}
        >
          {shortValue}
        </Avatar>
    );
  }
}

var firstScore = {
  sport: 'Football',
  key: 'first_score',
  optionsDefine: ['_HOME', '_AWAY'],
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

var supportedResultTypes = [winner, firstScore, winnerRange ];

export default {
  supportedResultTypes,
}
