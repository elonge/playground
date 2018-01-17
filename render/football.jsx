import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {'font-size': '12px', textAlign: 'center'};

const winner = {
  sport: 'Football',
  key: 'winner',
  name: 'Pick the winner',
  extraInfoDescription: null,
  options: ['_HOME', '_AWAY'],
  nullPrimary: 'Pick your winner',
  primary: 'Your winner: _VALUE',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : '2');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

const winnerRange = {
  sport: 'Football',
  key: 'winner_range',
  name: 'Pick the winner and range',
  extraInfoDescription: null,
  options: ['_HOME by 7 points or more', '_HOME by less than 7 points','_AWAY by 7 points or more','_AWAY by less than 7 points'],
  nullPrimary: 'Pick your winner',
  primary: '_VALUE',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    let shortValue;
    let shortTeam = (prediction.value.startsWith(prediction.home_team) ? prediction.home_team : prediction.away_team);
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

const firstScore = {
  sport: 'Football',
  key: 'first_score',
  name: 'Pick the team to score first',
  extraInfoDescription: null,
  options: ['_HOME', '_AWAY'],
  nullPrimary: 'Which team will score first?',
  primary: '_VALUE will score first',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

const supportedResultTypes = [winner, firstScore, winnerRange ];

export default {
  supportedResultTypes,
}
