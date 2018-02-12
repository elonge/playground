import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = {'font-size': '12px', textAlign: 'center'};

const winner = {
  sport: 'soccer',
  key: 'winner',
  name: 'Pick the winner',
  extraInfoDescription: null,
  options: ['_HOME', 'Draw', '_AWAY'],
  nullPrimary: 'Pick your winner',
  primary: 'Your winner: _VALUE',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

const toScore = {
  sport: 'soccer',
  key: 'to_score',
  name: 'A player will score',
  extraInfoDescription: 'Which player (e.g. Messi)',
  options: ['Yes', 'No'],
  nullPrimary: 'Will _PREDICT score?',
  primary: 'Will _PREDICT score?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

// const firstScore = {
//   sport: 'soccer',
//   key: 'first_score',
//   name: 'A team will score first',
//   extraInfoDescription: null,
//   options: ['_HOME', '_AWAY', 'None'],
//   nullPrimary: 'Which team will score first?',
//   primary: '_VALUE will score first',
//   rightAvatar: function(prediction) {
//     let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
//     return (
//         <Avatar>
//           {shortValue}
//         </Avatar>
//     );
//   }
// }

const firstScoreTime = {
  sport: 'soccer',
  key: 'first_score_time',
  name: 'When will be the first goal',
  extraInfoDescription: null,
  options: ['On first 30 minutes', 'Between 31-60 minutes', 'After 60 minutes','None'],
  nullPrimary: 'When will be the the first goal?',
  primary: 'First goal _VALUE',
  rightAvatar: function(prediction) {
    let shortValue = "None";
    switch (prediction.value) {
      case 'On first 30 minutes':
        shortValue = "<30";
        break;
      case 'Between 31-60 minutes':
          shortValue = "31-60";
          break;
      case 'After 60 minutes':
          shortValue = ">60";
          break;
    }
    return (
      <Avatar
        style={style}
      >
        {shortValue}
      </Avatar>
    );
  }
}

const numGoals = {
  sport: 'soccer',
  key: 'num_goals',
  name: 'How many goals',
  extraInfoDescription: null,
  options: ['0','1','2','3','4','5','6','7','8+'],
  nullPrimary: 'How many goals?',
  primary: 'Number of total goals is _VALUE',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const bothScore = {
  sport: 'soccer',
  key: 'both_score',
  name: 'Both teams will score',
  extraInfoDescription: null,
  options: ['Yes','No'],
  nullPrimary: 'Will both teams score?',
  primary: 'Will both teams score? _VALUE',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}



const homePenalty = {
  sport: 'soccer',
  key: 'home_penalty',
  name: 'Home team will have a penalty',
  extraInfoDescription: null,
  options: ['Yes', 'No'],
  nullPrimary: '_HOME will have a penalty?',
  primary: '_HOME will have a penalty?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const awayPenalty = {
  sport: 'soccer',
  key: 'away_penalty',
  name: 'Away team will have a penalty',
  extraInfoDescription: null,
  options: ['Yes', 'No'],
  nullPrimary: '_AWAY will have a penalty?',
  primary: '_AWAY will have a penalty?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

/*** Backward compatability ***/
const gameEvent = {
  sport: 'soccer',
  key: 'event',
  options: ['Yes', 'No'],
  nullPrimary: '_HOME will have a penalty?',
  primary: '_HOME will have a penalty?',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const exactScore = {
  sport: 'soccer',
  key: 'exact_score',
  options: ['Yes', 'No'],
  nullPrimary: 'Exact score will be _PREDICT',
  primary: 'Exact score will be _PREDICT',
  rightAvatar: function(prediction) {
    return (
        <Avatar>
          {prediction.value}
        </Avatar>
    );
  }
}

const scoreFirst = {
  sport: 'soccer',
  key: 'scoreFirst',
  name: 'Team will score first',
  extraInfoDescription: null,
  options: ['_HOME', '_AWAY', 'None'],
  nullPrimary: 'Which team will score first?',
  primary: '_VALUE will score first',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}

const scoreLast = {
  sport: 'soccer',
  key: 'scoreLast',
  name: 'Team will score last',
  extraInfoDescription: null,
  options: ['_HOME', '_AWAY', 'None'],
  nullPrimary: 'Which team will score last?',
  primary: '_VALUE will score last',
  rightAvatar: function(prediction) {
    let shortValue = (prediction.value == prediction.home_team ? '1' : prediction.value == prediction.away_team ? '2' : 'X');
    return (
        <Avatar>
          {shortValue}
        </Avatar>
    );
  }
}


const supportedResultTypes = [winner, toScore, numGoals, homePenalty, awayPenalty, firstScoreTime, bothScore,scoreFirst,scoreLast ];

export default {
  supportedResultTypes,
}
