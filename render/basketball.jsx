import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {'font-size': '12px', textAlign: 'center'};

const winner = {
  sport: 'basketball',
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

const toScore = {
  sport: 'basketball',
  key: 'to_score',
  name: 'A player top scorer',
  extraInfoDescription: 'Which player (e.g. Durant)',
  options: ['Yes', 'No'],
  nullPrimary: '_PREDICT top scorer?',
  primary: '_PREDICT top scorer?',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const winnerRange = {
  sport: 'basketball',
  key: 'winner_range',
  name: 'Pick the winner and range',
  extraInfoDescription: null,
  options: ['_HOME by 10 points or more', '_HOME by less than 10 points','_AWAY by 10 points or more','_AWAY by less than 10 points'],
  nullPrimary: 'Pick your winner',
  primary: '_VALUE',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    let shortValue;
    let shortTeam = (prediction.value.startsWith(prediction.home_team) ? prediction.home_team : prediction.away_team);
    shortValue = (prediction.value.indexOf('more') < 0 ? shortTeam + ' 10-' : shortTeam + ' 10+');
    return (
      <Avatar
        style={style}
      >
        {shortValue}
      </Avatar>
    );
  }
}

const doubleDigits = {
  sport: 'basketball',
  key: 'player_double_digit',
  name: 'A player will have double digits',
  extraInfoDescription: 'Which player (e.g. Casspi)',
  options: ['Yes', 'No'],
  nullPrimary: '_PREDICT will score double digits?',
  primary: '_PREDICT will score double digits?',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const scoreMore = {
  sport: 'basketball',
  key: 'player_score_more',
  name: 'Player1 will score more than Player2',
  extraInfoDescription: 'Player1,Player2 (e.g. Durant,Curry)',
  options: ['_OPTION1', '_OPTION2'],
  nullPrimary: 'Which will score more?',
  primary: '_VALUE will score more',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
      <Avatar
        style={style}
      >
          {prediction.value}
        </Avatar>
    );
  }
}

const player_score_range_low = {
  sport: 'basketball',
  key: 'player_score_range_low',
  name: 'A player will score (low)',
  extraInfoDescription: 'Which player (e.g. Casspi)',
  options: ['0-5 points', '6-10 points', 'More than 10 points'],
  nullPrimary: 'How many points will _PREDICT score?',
  primary: '_VALUE will score _VALUE',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
      <Avatar
        style={style}
      >
          {prediction.value}
        </Avatar>
    );
  }
}

const player_score_range_high = {
  sport: 'basketball',
  key: 'player_score_range_high',
  name: 'A player will score (high)',
  extraInfoDescription: 'Which player (e.g. Casspi)',
  options: ['0-10 points', '10-20 points', '20-30 points', 'More than 30 points'],
  nullPrimary: 'How many points will _PREDICT score?',
  primary: '_VALUE will score _VALUE',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
      <Avatar
        style={style}
      >
          {prediction.value}
        </Avatar>
    );
  }
}


const supportedResultTypes = [winner, toScore, winnerRange, doubleDigits, scoreMore, player_score_range_low,player_score_range_high ];

export default {
  supportedResultTypes,
}
