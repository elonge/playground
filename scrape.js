var request = require('request');
var cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const shortNames = {
  "Brighton & Hove Albion": "Brighton",
  "Manchester United" : "Man United",
  "Manchester City" : "Man City",
  "Moadon Sport Ashdod": "Ashdod",
  "Hapoel Be'er": "Beer Sheva",
  "Huddersfield Town": "Huddersfield",
  "West Ham United" : "West Ham",
  "Leicester City" : "Leicester",
  "Newcastle United" : "Newcastle",
  "West Bromwich Albion" : "West Brom",
  "AFC Bournemouth" : "Bournemouth",
  "Hapoel Kiryat Shmona": "Kiryat Shmona",
  "Maccabi Tel-Aviv": "Maccabi TLV",
  "Hapoel Ashkelon": "Ashkelon",
  "Alav├⌐s": "Alaves",
  "Tottenham Hotspur": "Tottenham",
  "Borussia Monchengladbach": "Monchengladbach",
  "Deportivo La Coruña": "La Coruña",
};

function convertToShort(name) {
  let short = shortNames[name];
  if ( typeof short !== 'undefined' && short ) {
    return short;
  }
  return name;
}

function dumpAll() {
  let fileName = 'out/today_ALL.json';
  fs.writeFileSync(fileName, JSON.stringify(allGames));
  console.log(fileName + " was created!");
}

function handleSoccerGames(games, name) {
  let fileName = 'out/today_'+name+'.json';
  fs.writeFileSync(fileName, JSON.stringify(games));
  console.log(fileName + " was created!");
  allGames = allGames.concat(games);
}

function handleNBAGames(games) {
  let fileName = 'out/today_nba.json';
  fs.writeFileSync(fileName, JSON.stringify(games));
  console.log(fileName + " was created!");
  allGames = allGames.concat(games);
}

const getSoccerGames = (year, month, day, handler, site, name) => {
  var moment = require('moment-timezone');

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let url = site+year+month+day;
    console.log("url=" + url);
    await page.goto(url);
    const textContent = await page.evaluate(() => {
      return document.querySelector('.scores').outerHTML
    });

    let html = textContent;
    var $ = cheerio.load(html);
    let games=[];
    let classes=['.score-content'];
    classes.forEach(function(className) {
      $(className).each(function (index, element) {
        let currentGame = new Object();
        currentGame.home = convertToShort($(element).children().first().children().first().text().trim());
        currentGame.away = convertToShort($(element).children().first().children().first().next().text().trim());
        let timeSite = $(element).find('.time').text().trim();
        timeSite = timeSite.substring(0, timeSite.length-5);
        let fullTime = moment(year+"-"+month+"-"+day+" "+timeSite+ " +02:00", "YYYY-MM-DD hh:mm a Z");
        currentGame.time = fullTime.tz("utc").format();
        currentGame.sportType = "soccer";
        games.push(currentGame);
      });
    });

    console.log("------");
    console.log(JSON.stringify(games));
    handler(games, name);

    browser.close();
  })();
}

const getPLGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/english-premier-league/23/scores?date=', 'PL');
}

const getIsraeliGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/israeli-premier-league/2359/scores?date=', 'IL');
}

const getSpanishGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/spanish-primera-division/15/scores?date=', 'Spain');
}

const getItalyGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/italian-serie-a/12/scores?date=', 'Italy');
}

const getSpanishCupGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/spanish-copa-del-rey/80/scores?date=', 'Spain_Cup');
}

const getCarbaoCupGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/english-carabao-cup/41/scores?date=', 'Carbao_Cup');
}

const getFACupGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/english-fa-cup/40/scores?date=', 'FA_Cup');
}

const getGermanyGames = (year, month, day, handler, site) => {
  getSoccerGames(year, month, day, handler, 'http://www.espnfc.com/german-bundesliga/10/scores?date=', 'Germany');
}

const getNBAGames = (year, month, day, handler) => {
  var moment = require('moment-timezone');

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let url = 'https://www.cbssports.com/nba/schedules/day/'+month+day+"/regular";
    console.log("url=" + url);
    await page.goto(url);
    const textContent = await page.evaluate(() => {
      return document.querySelector('.data').outerHTML
    });

    let html = textContent;
    var $ = cheerio.load(html);
    let games=[];
    let classes=['table .row1', 'table .row2'];
    classes.forEach(function(className) {
      $(className).each(function (index, element) {
        let currentGame = new Object();
        currentGame.away=$(element).children().first().text();
        currentGame.home=$(element).children().first().next().text();
        let timeSite=$(element).children().first().next().next().text();
        let fullTime = moment(year+"-"+month+"-"+day+" "+timeSite+ " -05:00", "YYYY-MM-DD hh:mm a Z");
        currentGame.time = fullTime.tz("utc").format();
        currentGame.sportType = "basketball";
        games.push(currentGame);
      });
    });

    console.log("------");
    console.log(JSON.stringify(games));
    handler(games);

    browser.close();
  })();
}

const test1 = () => {
  var options = {
    url: 'http://stats.nba.com/stats/scoreboard/?GameDate=02/14/2015&LeagueID=00&DayOffset=0',
//    proxy: "http://51.15.137.26:3128",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'max-age=0',
      Host: 'stats.nba.com',
      Connection: 'keep-alive',
      'Accept-Language': 'en-US,en;q=0.8,af;q=0.6',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
      'Upgrade-Insecure-Requests': 1,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    }
  };
  request.get(options, function(err, response, body) {
    console.log("body=" + body);
    console.log("response=" + response);
    console.log("err=" + err);
  })
}

let allGames = [];

let year='2018';
let month='1';
let day='29';

getNBAGames(year, month, day, handleNBAGames);
getPLGames(year, month, day, handleSoccerGames);
getSpanishGames(year, month, day, handleSoccerGames);
getIsraeliGames(year, month, day, handleSoccerGames);
getItalyGames(year, month, day, handleSoccerGames);
getSpanishCupGames(year, month, day, handleSoccerGames);
getCarbaoCupGames(year, month, day, handleSoccerGames);
getFACupGames(year, month, day, handleSoccerGames);
getGermanyGames(year, month, day, handleSoccerGames);
//test1();
