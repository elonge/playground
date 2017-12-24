import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {'font-size': '12px', textAlign: 'center'};

var winner = {
  sport: 'basketball',
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

var toScore = {
  sport: 'basketball',
  key: 'to_score',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: '_PREDICT top scorer?',
  primaryDefine: '_PREDICT top scorer?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

var winnerRange = {
  sport: 'basketball',
  key: 'winner_range',
  optionsDefine: ['_HOME by 10 points or more', '_HOME by less than 10 points','_AWAY by 10 points or more','_AWAY by less than 10 points'],
  nullPrimaryDefine: 'Pick your winner',
  primaryDefine: '_VALUE',
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

var doubleDigits = {
  sport: 'basketball',
  key: 'player_double_digit',
  optionsDefine: ['Yes', 'No'],
  nullPrimaryDefine: '_PREDICT will score double digits?',
  primaryDefine: '_PREDICT will score double digits?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

var supportedResultTypes = [winner, toScore, winnerRange, doubleDigits ];

export default {
  supportedResultTypes,
}
