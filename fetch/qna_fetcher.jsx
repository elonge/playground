var request = require('request');
const API_URL = "https://sports-q-and-a-provider.herokuapp.com/api/";
const winnerQuestion =   {type: "WinnerDeltaPoints", myName:"winner_range"};
const mySupportedQuestions = [
  {type: "PointsLeader", myName:"player_score_more"},
  {type: "HowManyPoints", myName:"player_score_range_high"}
];
const NBA_BEST_PRIORITY = 2;
const NBA_COMPETITION_ID = 6;
let teams = {};
let currentPriority = NBA_BEST_PRIORITY;


const fetchData = (sport, endpoint, handler) => {
  const fullUrl = API_URL+sport+"/"+endpoint;
  request.get(fullUrl, function(err, response, body) {
    switch (response.statusCode) {
      case 503:
        console.log("q-and-a not ready... will retry later");
        setTimeout(() => fetchData(sport, endpoint, handler), 3 * 60 * 1000);
        break;
      case 200:
        //console.log(body);
        handler(sport, JSON.parse(body), endpoint);
        break;
      default:
        console.error("Unknown response! " + response.code + " quitting ");
        console.error("response=" + JSON.stringify(response));
        console.error("err=" + err);
    }
  })
}

const handleNBACandidatesResponse = (sport, candidates, endpoint) => {
  let nbaGames = [];
  candidates.map((game) => {
    let currentGame = new Object();
    currentGame.home = teams[game.home_team][0];
    currentGame.away = teams[game.visitor_team][0];
    currentGame.time = new Date(game.date * 1000);
    currentGame.sportType = "basketball";
    currentGame.competitionId = NBA_COMPETITION_ID;
    currentGame.importance = game.importance;
    currentGame.externalId = game.id;
    nbaGames.push(currentGame);
  });
  console.log(JSON.stringify(nbaGames));
  fetchQuestions(sport, nbaGames);
}

const handleFetchMetaResponse = (sport, metaData, endpoint) => {
  teams = metaData.teams;
  fetchData(sport, 'candidates', handleNBACandidatesResponse);
}

function importanceCompare(a,b) {
  if (a.importance < b.importance)
    return -1;
  if (a.importance > b.importance)
    return 1;
  return 0;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const askQuestionType = (sport, game, questionType) => {
  let endpoint = "questions?id="+game.externalId+"&question_type=" + questionType.type;
  console.log("==== " + endpoint);
  fetchData(sport, endpoint, handleQuestionTypeResponse);
}

const handleQuestionTypeResponse = (sport, questionResponse, endpoint) => {
  const data = questionResponse.data;
  console.log("===================================="+questionResponse.title +","+data.type);
  let resultType;
  let predictedScore = '';
  if (data.type == winnerQuestion.type) {
    resultType = winnerQuestion.myName;
  } else {
    resultType = mySupportedQuestions.find((question) => question.type == data.type).myName;
    if (data.type == 'HowManyPoints') {
      predictedScore = data.player;
    } else if (data.type == 'PointsLeader') {
      predictedScore = data.home_team_leader+","+data.visitor_team_leader;
    }
  }
  let prediction = new Object();
  prediction.gameId = -1; // missing (internal gameId -- need to add to model first)
  prediction.open = true;
  prediction.creatorId = 0;
  prediction.typeExtra = '';
  prediction.resultType = resultType;
  prediction.predictedScore = predictedScore;
  prediction.priority = currentPriority++;
  prediction.points = 1;
  console.log(JSON.stringify(prediction));
}

const fetchQuestions = (sport, nbaGames) => {
  let randomQuestionTypes = JSON.parse(JSON.stringify(mySupportedQuestions));
  shuffle(randomQuestionTypes);
  let sortedNBAGames = nbaGames.sort(importanceCompare).reverse();
  switch (sortedNBAGames.length) {
    case 0:
      console.log("No games! Do nothing");
      break;
    case 1:
      console.log("1 game. Asking 3 questions about it");
      askQuestionType(sport, sortedNBAGames[0], winnerQuestion);
      askQuestionType(sport, sortedNBAGames[0], randomQuestionTypes[0]);
      askQuestionType(sport, sortedNBAGames[0], randomQuestionTypes[1]);
      break;
    case 2:
      console.log("2 games. Asking 2 questions each");
      askQuestionType(sport, sortedNBAGames[0], winnerQuestion);
      askQuestionType(sport, sortedNBAGames[0], randomQuestionTypes[0]);
      askQuestionType(sport, sortedNBAGames[1], winnerQuestion);
      askQuestionType(sport, sortedNBAGames[1], randomQuestionTypes[1]);
      break;
    default:
      console.log("3 or more games. Asking 2 questions about the first, and 1 for the others (up to 5 qs)");
      askQuestionType(sport, sortedNBAGames[0], winnerQuestion);
      askQuestionType(sport, sortedNBAGames[0], randomQuestionTypes[0]);
      askQuestionType(sport, sortedNBAGames[1], winnerQuestion);
      askQuestionType(sport, sortedNBAGames[2], randomQuestionTypes[1]);
      if (sortedNBAGames.length > 3) {
        askQuestionType(sport, sortedNBAGames[3], winnerQuestion);
      }
      break;
  }

/*
    let prediction = new Object();
    prediction.gameId = -1; // missing (internal gameId -- need to add to model first)
    prediction.open = true;
    prediction.creatorId = 0;
    prediction.typeExtra = '';
    prediction.resultType = ''; // Take from the server's question
    prediction.predictedScore = ''; // Take from the server's question
    prediction.priority = priority++;
    prediction.points = 1;
    // Add to server
  */
}

fetchData('nba', 'meta', handleFetchMetaResponse);
