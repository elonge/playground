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
};

function convertToShort(name) {
  let short = shortNames[name];
  if ( typeof short !== 'undefined' && short ) {
    return short;
  }
  return name;
}

function handleSoccerGames(games, name) {
  let fileName = 'out/today_'+name+'.json';
  fs.writeFileSync(fileName, JSON.stringify(games));
  console.log(fileName + " was created!");
}

function handleNBAGames(games) {
  let fileName = 'out/today_nba.json';
  fs.writeFileSync(fileName, JSON.stringify(games));
  console.log(fileName + " was created!");
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
    console.log(html);
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

let year='2018';
let month='1';
let day='20';
getNBAGames(year, month, day, handleNBAGames);
getPLGames(year, month, day, handleSoccerGames);
getSpanishGames(year, month, day, handleSoccerGames);
getIsraeliGames(year, month, day, handleSoccerGames);
