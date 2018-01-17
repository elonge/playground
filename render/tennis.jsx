import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {'font-size': '12px', textAlign: 'center'};

const winner = {
  sport: 'Tennis',
  key: 'winner',
  name: 'Pick the winner',
  extraInfoDescription: null,
  options: ['_HOME', '_AWAY'],
  nullPrimary: 'Pick your winner',
  primary: 'Your winner: _VALUE',
  secondary: '_HOME vs _AWAY (_STARTTIME)',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : '2');
    return (
      <Avatar
        style={style}
      >
        {prediction.value}
      </Avatar>
    );
  }
}

const numSets = {
  sport: 'Tennis',
  key: 'num_sets',
  name: 'Number of sets',
  extraInfoDescription: null,
  options: ['3', '4','5'],
  nullPrimary: 'Number of sets?',
  primary: '_VALUE sets',
  secondary: '_HOME vs _AWAY (_STARTTIME)',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const firstScore = {
  sport: 'Football',
  key: 'first_score',
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

const supportedResultTypes = [winner, numSets ];

export default {
  supportedResultTypes,
}
