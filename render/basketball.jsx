import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {'font-size': '12px', textAlign: 'center'};

const winner = {
  sport: 'basketball',
  key: 'winner',
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
  options: ['_OPTION1', '_OPTION2'],
  nullPrimary: 'Which will score more?',
  primary: '_VALUE will score more',
  secondary: '_AWAY at _HOME (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}


const supportedResultTypes = [winner, toScore, winnerRange, doubleDigits, scoreMore ];

export default {
  supportedResultTypes,
}
