const myUserId = 1482681765133413;

const users = [
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    name: 'Elon Gecht',
    online: true,
    fbId: 1482681765133413,
    moreFields: {
      sum: 48,
      avg: 0.494,
      count: 2,
      lastDaysPoints: "12253",
      JoinedDate: '2018-01-08T19:53:29.421Z'
    },
    JoinedDate: '2017-12-23',
    oneLine: 'Man United fan'
  },
  {
    profilePic: 'https://scontent.xx.fbcdn.net/v/t1.0-1/199362_5456381841_7751_n.jpg?oh=bb3391fa44f361b5e20a961f9a0900bd&oe=5AF52DC1',
    name: 'Arik Benado',
    online: true,
    fbId: 200,
    moreFields: {
      sum: 76,
      avg: 0.694,
      count: 1,
      lastDaysPoints: "42253"
    },
    JoinedDate: '2017-11-28',
    oneLine: 'Keeps my head up'
  },
  {
    profilePic: 'https://www.tbnsport.com/wp-content/uploads/moyes-manage.jpg',
    name: 'David Moyes',
    online: false,
    fbId: 300,
    moreFields: {
      sum: 11,
      avg: 0.54,
      count: 0,
      lastDaysPoints: "13"
    },
    JoinedDate: '2018-01-04',
    oneLine: 'Come on you irons!'
  },
];

const leagues = [
  {
    id: 0,
    league_name: 'All users',
    owner_id: 1482681765133413,
  },
  {
    id: 1,
    league_name: 'West 25',
    owner_id: 200,
  },
  {
    id: 2,
    league_name: 'Best team',
    owner_id: 300
  }
];

const usersPoints = [
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    totalPoints: 15,
    points1d: 3,
    name: 'Elon Gecht',
    online: true,
    fbId: 1482681765133413,
    sunday: '2017-12-24',
    league: 0
  },
  {
    profilePic: 'https://scontent.xx.fbcdn.net/v/t1.0-1/199362_5456381841_7751_n.jpg?oh=bb3391fa44f361b5e20a961f9a0900bd&oe=5AF52DC1',
    totalPoints: 8,
    points1d: 3,
    name: 'Arik Benado',
    online: true,
    fbId: 200,
    sunday: '2017-12-24',
    league: 0
  },
  {
    profilePic: 'https://www.tbnsport.com/wp-content/uploads/moyes-manage.jpg',
    totalPoints: 2,
    points1d: 1,
    name: 'David Moyes',
    online: false,
    fbId: 300,
    sunday: '2017-12-24',
    league: 0
},
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    totalPoints: 11,
    points1d: 0,
    name: 'Elon Gecht',
    online: true,
    fbId: 1482681765133413,
    sunday: '2017-12-17',
    league: 0
  },
  {
    profilePic: 'https://www.tbnsport.com/wp-content/uploads/moyes-manage.jpg',
    totalPoints: 9,
    points1d: 0,
    name: 'David Moyes',
    online: false,
    fbId: 300,
    sunday: '2017-12-17',
    league: 0
  },
  {
    profilePic: 'https://scontent.xx.fbcdn.net/v/t1.0-1/199362_5456381841_7751_n.jpg?oh=bb3391fa44f361b5e20a961f9a0900bd&oe=5AF52DC1',
    totalPoints: 8,
    points1d: 0,
    name: 'Arik Benado',
    online: true,
    fbId: 200,
    sunday: '2017-12-17',
    league: 0
  },
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    totalPoints: 15,
    points1d: 3,
    name: 'Elon Gecht',
    online: true,
    fbId: 1482681765133413,
    sunday: '2017-12-24',
    league: 1
  },
  {
    profilePic: 'https://scontent.xx.fbcdn.net/v/t1.0-1/199362_5456381841_7751_n.jpg?oh=bb3391fa44f361b5e20a961f9a0900bd&oe=5AF52DC1',
    totalPoints: 8,
    points1d: 3,
    name: 'Arik Benado',
    online: true,
    fbId: 200,
    sunday: '2017-12-24',
    league: 1
  },
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    totalPoints: 15,
    points1d: 3,
    name: 'Elon Gecht',
    online: true,
    fbId: 1482681765133413,
    sunday: '2017-12-24',
    league: 2
  },
  {
    profilePic: 'https://www.tbnsport.com/wp-content/uploads/moyes-manage.jpg',
    totalPoints: 2,
    points1d: 1,
    name: 'David Moyes',
    online: false,
    fbId: 300,
    sunday: '2017-12-24',
    league: 2
  },
]


const userPredictions = [
  {
    user_id: 1482681765133413,
    home_team: 'Lakers',
    away_team: 'Warriors',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-22 17:00:00',
    value: 'Lakers by 10 points or more',
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 1,
    points_updated: true,
    game_id: 22,
    sport_type: 'Basketball',
    id:1
  },
  {
    user_id: 1482681765133413,
    home_team: 'Arsenal',
    away_team: 'Burnley',
    result_type: 'winner',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: 'Arsenal',
    open: true,
    points: 1,
    close_on_start_time: true,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: true,
    game_id: 2,
    sport_type: 'Soccer',
    id:1
  },
  {
    user_id: 1482681765133413,
    home_team: 'Titans',
    away_team: 'Rams',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 2,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: false,
    game_id: 29,
    sport_type: 'Football',
    id:1
  },
  {
    user_id: 1482681765133413,
    home_team: 'Brighton',
    away_team: 'Watford',
    result_type: 'exact_score',
    predicted_score: '2-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-17',
    points_updated: false,
    points_won: 0,
    game_id: 2,
    sport_type: 'Soccer',
    id:2
  },
  {
    user_id: 1482681765133413,
    home_team: 'Everton',
    away_team: 'Swansea',
    result_type: 'num_goals',
    predicted_score: '3-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-19',
    points_updated: false,
    points_won: 0,
    sport_type: 'Soccer',
    game_id: 3,
    id:2
  },
  {
    user_id: 1482681765133413,
    home_team: 'Newcastle',
    away_team: 'West Brom',
    result_type: 'winner',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 9,
    sport_type: 'Soccer',
    id:88
  },
  {
    user_id: 1482681765133413,
    home_team: 'Watford',
    away_team: 'West Brom',
    result_type: 'to_score',
    predicted_score: 'Richarlison',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 5,
    sport_type: 'Soccer',
    id:2
  },
  {
    user_id: 1482681765133413,
    home_team: 'Valencia',
    away_team: 'Real Madrid',
    result_type: 'first_score',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-26 20:00:00',
    value: 'Valencia',
    open: true,
    points: 1,
    close_on_start_time: true,
    prediction_date: '2017-12-26',
    points_updated: false,
    points_won: 0,
    game_id: 4,
    sport_type: 'Soccer',
    id:3
  },
  {
    user_id: 1482681765133413,
    home_team: 'Barcelona',
    away_team: 'Valencia',
    result_type: 'event',
    predicted_score: '2-1',
    type_extra: 'num_goals',
    start_time: '2017-12-15 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-15',
    points_updated: false,
    points_won: 0,
    sport_type: 'soccer',
    game_id: 6,
    id:2
  },
]
const otherPredictions = [
  {
    user_id: 200,
    home_team: 'Lakers',
    away_team: 'Warriors',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-22 17:00:00',
    value: 'Lakers by 10 points or more',
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 1,
    points_updated: true,
    game_id: 22,
    sport_type: 'Basketball',
    id:1
  },
  {
    user_id: 200,
    home_team: 'Arsenal',
    away_team: 'Burnley',
    result_type: 'winner',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: 'Arsenal',
    open: true,
    points: 1,
    close_on_start_time: true,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: true,
    game_id: 2,
    sport_type: 'Soccer',
    id:1
  },
  {
    user_id: 200,
    home_team: 'Titans',
    away_team: 'Rams',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 2,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: false,
    game_id: 29,
    sport_type: 'Football',
    id:1
  },
  {
    user_id: 200,
    home_team: 'Brighton',
    away_team: 'Watford',
    result_type: 'exact_score',
    predicted_score: '2-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-17',
    points_updated: false,
    points_won: 0,
    game_id: 2,
    sport_type: 'Soccer',
    id:2
  },
  {
    user_id: 200,
    home_team: 'Newcastle',
    away_team: 'West Brom',
    result_type: 'winner',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 9,
    sport_type: 'Soccer',
    id:88
  },
  {
    user_id: 200,
    home_team: 'Watford',
    away_team: 'West Brom',
    result_type: 'to_score',
    predicted_score: 'Richarlison',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 5,
    sport_type: 'Soccer',
    id:2
  },
  {
    user_id: 200,
    home_team: 'Valencia',
    away_team: 'Real Madrid',
    result_type: 'first_score',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-26 20:00:00',
    value: 'Valencia',
    open: true,
    points: 1,
    close_on_start_time: true,
    prediction_date: '2017-12-26',
    points_updated: false,
    points_won: 0,
    game_id: 4,
    sport_type: 'Soccer',
    id:3
  },
  {
    user_id: 200,
    home_team: 'Barcelona',
    away_team: 'Valencia',
    result_type: 'event',
    predicted_score: '2-1',
    type_extra: 'num_goals',
    start_time: '2017-12-15 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-15',
    points_updated: false,
    points_won: 0,
    sport_type: 'soccer',
    game_id: 6,
    id:2
  },
  {
    user_id: 300,
    home_team: 'Lakers',
    away_team: 'Warriors',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-22 17:00:00',
    value: 'Lakers by 10 points or more',
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 1,
    points_updated: true,
    game_id: 22,
    sport_type: 'Basketball',
    id:1
  },
  {
    user_id: 300,
    home_team: 'Arsenal',
    away_team: 'Burnley',
    result_type: 'winner',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: 'Arsenal',
    open: true,
    points: 1,
    close_on_start_time: true,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: true,
    game_id: 2,
    sport_type: 'Soccer',
    id:1
  },
  {
    user_id: 300,
    home_team: 'Titans',
    away_team: 'Rams',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 2,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: false,
    game_id: 29,
    sport_type: 'Football',
    id:1
  },
  {
    user_id: 300,
    home_team: 'Brighton',
    away_team: 'Watford',
    result_type: 'exact_score',
    predicted_score: '2-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-17',
    points_updated: false,
    points_won: 0,
    game_id: 2,
    sport_type: 'Soccer',
    id:2
  },
  {
    user_id: 300,
    home_team: 'Everton',
    away_team: 'Swansea',
    result_type: 'num_goals',
    predicted_score: '3-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-19',
    points_updated: false,
    points_won: 0,
    sport_type: 'Soccer',
    game_id: 3,
    id:2
  },
  {
    user_id: 300,
    home_team: 'Newcastle',
    away_team: 'West Brom',
    result_type: 'winner',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 9,
    sport_type: 'Soccer',
    id:88
  },
  {
    user_id: 300,
    home_team: 'Watford',
    away_team: 'West Brom',
    result_type: 'to_score',
    predicted_score: 'Richarlison',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 5,
    sport_type: 'Soccer',
    id:2
  },
  {
    user_id: 300,
    home_team: 'Valencia',
    away_team: 'Real Madrid',
    result_type: 'first_score',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-26 20:00:00',
    value: 'Valencia',
    open: true,
    points: 1,
    close_on_start_time: true,
    prediction_date: '2017-12-26',
    points_updated: false,
    points_won: 0,
    game_id: 4,
    sport_type: 'Soccer',
    id:3
  },
  {
    user_id: 300,
    home_team: 'Barcelona',
    away_team: 'Valencia',
    result_type: 'event',
    predicted_score: '2-1',
    type_extra: 'num_goals',
    start_time: '2017-12-15 17:00:00',
    value: null,
    open: true,
    points: 1,
    close_on_start_time: false,
    prediction_date: '2017-12-15',
    points_updated: false,
    points_won: 0,
    sport_type: 'soccer',
    game_id: 6,
    id:2
  },
];

export default {
  myUserId,
  users,
  usersPoints,
  userPredictions,
  otherPredictions,
  leagues,
}
