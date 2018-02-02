import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';


const dialogStyle = {
  width: '100%',
  maxWidth: 'none',
};

class CreateLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      isCreate: props.isCreate,
      newLeagueName: '',
      enteredCode: '',
      newLeague: null,
      newLeagueError: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      enteredCode: '',
      snackbarMessage: '',
    };
    this.onNewLeagueNameChanged = this.onNewLeagueNameChanged.bind(this);
    this.onCodeUpdated = this.onCodeUpdated.bind(this);
    this.onCreateLeague = this.onCreateLeague.bind(this);
    this.onGetLeagueByCode = this.onGetLeagueByCode.bind(this);
    this.onInviteFriends = this.onInviteFriends.bind(this);
    this.onApproveJoining = this.onApproveJoining.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.renderCreateLeague = this.renderCreateLeague.bind(this);
    this.renderJoinLeague = this.renderJoinLeague.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.onCreateLeagueServerResponse = this.onCreateLeagueServerResponse.bind(this);
    this.onGetLeagueServerResponse = this.onGetLeagueServerResponse.bind(this);
    this.onJoinLeagueServerResponse = this.onJoinLeagueServerResponse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open == this.state.open && nextProps.isCreate == this.state.isCreate) {
      // outside changes should not effect dialog (unless dialog is opened/close or change question)
      return;
    }
    this.setState( {
      open: nextProps.open,
      isCreate: nextProps.isCreate,
      newLeagueName: '',
      enteredCode: '',
      newLeague: null,
      newLeagueError: '',
      joinLeagueError: '',
      joinLeague: null,
      waitingToServer: false,
      enteredCode: '',
      snackbarMessage: '',
    });
  }

  pushToRemote(channel, message, statusHandler) {
    this.setState({waitingToServer: true});

    this.props.socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.senderId,
        ...message,
      },
      (status) => {
        console.log(channel + ": " + JSON.stringify(status));

        this.setState({
          waitingToServer:false,
        });

        statusHandler(channel, status);
      }
    );
  }

  onDialogCancel() {
    this.setState({open: false, snackbarMessage: ''});
    this.props.handleClose();
  };

  onNewLeagueNameChanged(event) {
    this.setState({newLeagueName: event.target.value});
  }

  onCodeUpdated(event) {
    this.setState({enteredCode: event.target.value});
  }

  onInviteFriends() {
    this.props.onInviteNewLeague(this.state.newLeague);
  }

  onApproveJoining() {
    this.pushToRemote("league:join", {leagueId: this.state.joinLeague.id}, this.onJoinLeagueServerResponse);
  }

  onJoinLeagueServerResponse(channel, response) {
    if (response.startsWith("ok")) {
      let snackbarMessage = 'Joined league ' + this.state.joinLeague.league_name;
      this.setState({snackbarMessage:snackbarMessage});
      this.props.onNewLeague(this.state.joinLeague);
    } else {
      this.setState({joinLeagueError:response, joinLeague: null});
    }
  }

  onGetLeagueByCode() {
    this.pushToRemote("league:by_code", {leagueCode: this.state.enteredCode}, this.onGetLeagueServerResponse);
  }

  onGetLeagueServerResponse(channel, response) {
    if (response.startsWith("ok: ")) {
      let league = JSON.parse(response.substring(4));
      this.setState({joinLeagueError:'', joinLeague: league});
    } else {
      this.setState({joinLeagueError:response, joinLeague: null});
    }
  }

  onCreateLeague() {
    this.pushToRemote("league:insert", {leagueName: this.state.newLeagueName}, this.onCreateLeagueServerResponse);
  }

  onCreateLeagueServerResponse(channel, response) {
    console.log()
    if (response.startsWith("ok: ")) {
      let league = JSON.parse(response.substring(4));
      this.setState({newLeagueError:'', newLeague: league});
      this.props.onNewLeague(league);
    } else {
      this.setState({newLeagueError:response, newLeague: null});
    }
  }

  renderCreateLeague() {
    let isCode = this.state.newLeague != null;
    console.log('isCode='+isCode+"; " + JSON.stringify(this.state.newLeague));
    let isSnack = this.state.snackbarMessage.length > 0;
    const actions = [
      <FlatButton
        label={isCode ? "Exit" : "Cancel"}
        primary={true}
        keyboardFocused={true}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isCode ? "Invite friends..." : "Create a league"}
        primary={true}
        keyboardFocused={true}
        onClick={isCode ? this.onInviteFriends : this.onCreateLeague}
        disabled = {isSnack || this.state.waitingToServer}
      />,
    ];

    return (
      <Dialog
        title="Create a new league"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
        contentStyle={dialogStyle}
      >
      <div>
        <TextField
          value={this.state.newLeagueName}
          onChange={this.onNewLeagueNameChanged}
          errorText={this.state.newLeagueError}
          hintText="Please enter a unique league name"
        /><br />
        <TextField
          disabled={true}
          hintText="League Code"
          value={(isCode ? 'League created! Code is ' + this.state.newLeague.league_code : '')}
        /><br />
      </div>
      </Dialog>
    );
  }

  renderJoinLeague() {
    let isLeague = this.state.joinLeague != null;
    let isSnack = this.state.snackbarMessage.length > 0;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        disabled = {isSnack}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isLeague ? "Approve Joining" : "Join league..."}
        primary={true}
        keyboardFocused={true}
        disabled = {isSnack || this.state.waitingToServer}
        onClick={isLeague ? this.onApproveJoining : this.onGetLeagueByCode}
      />,
    ];

    return (
      <Dialog
        title="Join a league"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        contentStyle={dialogStyle}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
      >
        <div>
          <TextField
            disabled={false}
            hintText="Please enter the league code"
            value={this.state.enteredCode}
            errorText={this.state.joinLeagueError}
            onChange={this.onCodeUpdated}
          /><br />
          <TextField
            value={isLeague ?"League name is " + this.state.joinLeague.league_name : ""}
            disabled={true}
            hintText="League name"
          /><br />
          <Snackbar
            open={isSnack}
            message={this.state.snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.onDialogCancel}
          />
        </div>
      </Dialog>
    );
  }

  render() {
    if (this.state.isCreate) {
      return this.renderCreateLeague();
    } else {
      return this.renderJoinLeague();
    }
  }
}

CreateLeagueDialog.propTypes = {
};

export default CreateLeagueDialog;

/**
id                  | 234
game_id             | 282
result_type         | to_score
type_extra          |
open                | f
predicted_score     | Messi
prediction_updated  | t
points              | 1
prediction_type     | boolean
real_result         | Yes
close_on_start_time | t
prediction_date     | 2018-01-25
creator_id          | 0
id                  | 282
home_team           | Barcelona
away_team           | Espanyol
start_time          | 2018-01-25 20:30:00+00
status              | before
sport_type          | soccer
competition_id      |
user_id             | 1482681765133413
prediction_id       | 234
game_id             | 282
value               | Yes
points_won          | 1
points_updated      | t
-[ RECORD 2 ]-------+-----------------------------------

select league_id,for_league_ids,"game_predictions".id,"game_predictions".game_id,predicted_score,prediction_updated,prediction_date,creator_id,home_team,competition_id,user_predictions.user_id,value,points_updated from "game_predictions"
left join "games" on "game_predictions"."game_id" = "games"."id"
left join "user_predictions" on "game_predictions"."id" = "user_predictions"."prediction_id" and "user_predictions"."user_id" = 1482681765133413 and "game_predictions"."game_id" = "user_predictions"."game_id"
left join users_leagues on users_leagues.user_id=1482681765133413
where prediction_date > current_date - interval '7 days' and
(for_league_ids is null or league_id = ANY(for_league_ids)) and
exists(select competition_id from leagues_competitions where competition_id=games.competition_id and league_id=users_leagues.league_id)
 order by "start_time" asc;


 (for_league_ids is null or league_id = ANY(for_league_ids))

 creator_id=1482681765133413 or exists(select league_id,count(*) from users_leagues where league_id<>1 and user_id in (game_predictions.creator_id,1482681765133413) group by league_id having count(*) > 1)) and

--- POINTS ---



select user_predictions.user_id as user_id, users_leagues.league_id as league_id, sum(points_won) as points from "user_predictions" left join "game_predictions" on "game_predictions"."id" = "user_predictions"."prediction_id" and "game_predictions"."game_id" = "user_predictions"."game_id" left join "users_leagues" on "user_predictions"."user_id" = "users_leagues"."user_id" left join leagues on users_leagues.league_id=leagues.id where league_id = ANY(for_league_ids) or for_league_ids is null and prediction_date > leagues.created_time group by user_predictions.user_id,users_leagues.league_id  order by points desc

select user_predictions.user_id as user_id, users_leagues.league_id as league_id, prediction_date-extract(dow from prediction_date)::integer as sunday, sum(points_won) as points, sum(points_won) filter (where prediction_date=(select max(prediction_date) from game_predictions where prediction_updated=true)) as points_1d from "user_predictions" left join "game_predictions" on "game_predictions"."id" = "user_predictions"."prediction_id" and "game_predictions"."game_id" = "user_predictions"."game_id" left join "users_leagues" on "user_predictions"."user_id" = "users_leagues"."user_id" group by user_predictions.user_id,users_leagues.league_id,sunday order by points desc;

--- DAILY Winners ----
select array_agg(o.user_id),o.league_id,o.prediction_date,o.points from (select up.user_id, ul.league_id, prediction_date, sum(points_won) as points from user_predictions up left join game_predictions gp on gp.id=up.prediction_id and gp.game_id=up.game_id left join users_leagues ul on up.user_id=ul.user_id group by up.user_id, ul.league_id,prediction_date) as o left join (select up.user_id, ul.league_id, prediction_date, sum(points_won) as points from user_predictions up left join game_predictions gp on gp.id=up.prediction_id and gp.game_id=up.game_id left join users_leagues ul on up.user_id=ul.user_id group by up.user_id, ul.league_id,prediction_date) as agg2 on o.league_id=agg2.league_id and o.prediction_date=agg2.prediction_date and o.points < agg2.points where agg2.points is null group by o.league_id,o.prediction_date,o.points order by prediction_date desc, o.league_id;



const getUserPoints_new = () =>
  Knex.select(
    Knex.raw('user_predictions.user_id as user_id'),
    Knex.raw('users_leagues.league_id as league_id'),
    Knex.raw("sum(points_won) as points"),
    Knex.raw("sum(points_won) filter (where prediction_date=(select max(prediction_date) from game_predictions where prediction_updated=true)) as points_1d"))
  .from('user_predictions')
  .leftJoin('game_predictions', function() {
    this.on('game_predictions.id', '=', 'user_predictions.prediction_id')
    .andOn('game_predictions.game_id', '=', 'user_predictions.game_id')
  })
  .leftJoin('users_leagues', 'user_predictions.user_id', 'users_leagues.user_id')
  .leftJoin('leagues', 'users_leagues.league_id', 'leagues.id')
  .whereRaw('(league_id = ANY(game_predictions.for_league_ids) or game_predictions.for_league_ids is null) and (league_id = ANY(user_predictions.for_league_ids2) or user_predictions.for_league_ids2 is null) and prediction_date > leagues.created_time')
  .debug()
  .groupByRaw('user_predictions.user_id,users_leagues.league_id')
  .orderByRaw('points desc')
  .then((users) => {
    return Promise.all(users.map((user) => UserSocket.getUserDetails(user.user_id, user)))
    .then((userDetails) => userDetails.map((detail = {}) => {
      return ({
        totalPoints: detail.moreFields.points,
        points1d: detail.moreFields.points_1d,
        name:detail.name,
        profilePic:detail.profilePic,
        fbId:detail.fbId,
        league:detail.moreFields.league_id,
      });
    }))
  });

  .leftJoin('leagues', 'users_leagues.league_id', 'leagues.id')
  .whereRaw('(league_id = ANY(for_league_ids) or for_league_ids is null) and (league_id = ANY(user_predictions.for_league_ids2) or user_predictions.for_league_ids2 is null) and prediction_date > leagues.created_time')




  2018-02-01T13:22:39.000000+00:00 app[api]: Build started by user elon.gecht@gmail.com
  2018-02-01T13:23:17.781487+00:00 app[api]: Release v839 created by user elon.gecht@gmail.com
  2018-02-01T13:23:17.781487+00:00 app[api]: Deploy 33723572 by user elon.gecht@gmail.com
  2018-02-01T13:23:18.166194+00:00 heroku[web.1]: Restarting
  2018-02-01T13:23:18.166715+00:00 heroku[web.1]: State changed from up to starting
  2018-02-01T13:22:39.000000+00:00 app[api]: Build succeeded
  2018-02-01T13:23:18.923131+00:00 heroku[web.1]: Stopping all processes with SIGTERM
  2018-02-01T13:23:18.944840+00:00 heroku[router]: at=info method=GET path="/socket.io/?EIO=3&transport=websocket&sid=bncHv9ZJZriJ6ZfsAAAB" host=infinite-caverns-93636.herokuapp.com request_id=cc9a5deb-3d7a-4f17-8ef8-d5df626d6ec6 fwd="79.181.167.40" dyno=web.1 connect=1ms service=353549ms status=101 bytes=175 protocol=https
  2018-02-01T13:23:18.944767+00:00 heroku[router]: at=info method=GET path="/socket.io/?EIO=3&transport=websocket&sid=akKARn6F6l0_BwQuAAAA" host=infinite-caverns-93636.herokuapp.com request_id=6ad0676d-d54e-423a-ba46-7fd92e6060d4 fwd="79.181.167.40" dyno=web.1 connect=1ms service=354198ms status=101 bytes=175 protocol=https
  2018-02-01T13:23:19.032973+00:00 heroku[web.1]: Process exited with status 143
  2018-02-01T13:23:22.981616+00:00 heroku[web.1]: Starting process with command `npm start`
  2018-02-01T13:23:24.781187+00:00 app[web.1]:
  2018-02-01T13:23:24.781206+00:00 app[web.1]: > chat-extensions@0.1.0 start /app
  2018-02-01T13:23:24.781207+00:00 app[web.1]: > node ./bin/www
  2018-02-01T13:23:24.781208+00:00 app[web.1]:
  2018-02-01T13:23:25.224785+00:00 app[web.1]: /app/node_modules/babel-core/lib/transformation/file/options/option-manager.js:328
  2018-02-01T13:23:25.224818+00:00 app[web.1]:         throw e;
  2018-02-01T13:23:25.224820+00:00 app[web.1]:         ^
  2018-02-01T13:23:25.224822+00:00 app[web.1]:
  2018-02-01T13:23:25.224823+00:00 app[web.1]: Error: Couldn't find preset "latest" relative to directory "/app"
  2018-02-01T13:23:25.224825+00:00 app[web.1]:     at /app/node_modules/babel-core/lib/transformation/file/options/option-manager.js:293:19
  2018-02-01T13:23:25.224829+00:00 app[web.1]:     at OptionManager.resolvePresets (/app/node_modules/babel-core/lib/transformation/file/options/option-manager.js:275:20)
  2018-02-01T13:23:25.224827+00:00 app[web.1]:     at Array.map (<anonymous>)
  2018-02-01T13:23:25.224832+00:00 app[web.1]:     at OptionManager.mergeOptions (/app/node_modules/babel-core/lib/transformation/file/options/option-manager.js:249:14)
  2018-02-01T13:23:25.224830+00:00 app[web.1]:     at OptionManager.mergePresets (/app/node_modules/babel-core/lib/transformation/file/options/option-manager.js:264:10)
  2018-02-01T13:23:25.224834+00:00 app[web.1]:     at OptionManager.init (/app/node_modules/babel-core/lib/transformation/file/options/option-manager.js:368:12)
  2018-02-01T13:23:25.224837+00:00 app[web.1]:     at loader (/app/node_modules/babel-register/lib/node.js:144:14)
  2018-02-01T13:23:25.224836+00:00 app[web.1]:     at compile (/app/node_modules/babel-register/lib/node.js:103:45)
  2018-02-01T13:23:25.224839+00:00 app[web.1]:     at Object.require.extensions.(anonymous function) [as .js] (/app/node_modules/babel-register/lib/node.js:154:7)
  2018-02-01T13:23:25.224841+00:00 app[web.1]:     at Module.load (module.js:573:32)
  2018-02-01T13:23:25.232350+00:00 app[web.1]:
  2018-02-01T13:23:25.238379+00:00 app[web.1]: npm ERR! Linux 4.4.0-1011-aws
  2018-02-01T13:23:25.238562+00:00 app[web.1]: npm ERR! argv "/app/.heroku/node/bin/node" "/app/.heroku/node/bin/npm" "start"
  2018-02-01T13:23:25.238856+00:00 app[web.1]: npm ERR! npm  v4.0.5
  2018-02-01T13:23:25.238721+00:00 app[web.1]: npm ERR! node v9.5.0
  2018-02-01T13:23:25.239142+00:00 app[web.1]: npm ERR! chat-extensions@0.1.0 start: `node ./bin/www`
  2018-02-01T13:23:25.239026+00:00 app[web.1]: npm ERR! code ELIFECYCLE
  2018-02-01T13:23:25.239418+00:00 app[web.1]: npm ERR! Failed at the chat-extensions@0.1.0 start script 'node ./bin/www'.
  2018-02-01T13:23:25.239225+00:00 app[web.1]: npm ERR! Exit status 1
  2018-02-01T13:23:25.239324+00:00 app[web.1]: npm ERR!
  2018-02-01T13:23:25.239578+00:00 app[web.1]: npm ERR! Make sure you have the latest version of node.js and npm installed.
  2018-02-01T13:23:25.239679+00:00 app[web.1]: npm ERR! If you do, this is most likely a problem with the chat-extensions package,
  2018-02-01T13:23:25.239780+00:00 app[web.1]: npm ERR! not with npm itself.
  2018-02-01T13:23:25.239877+00:00 app[web.1]: npm ERR! Tell the author that this fails on your system:
  2018-02-01T13:23:25.239973+00:00 app[web.1]: npm ERR!     node ./bin/www
  2018-02-01T13:23:25.240072+00:00 app[web.1]: npm ERR! You can get information on how to open an issue for this project with:
  2018-02-01T13:23:25.240154+00:00 app[web.1]: npm ERR!     npm bugs chat-extensions
  2018-02-01T13:23:25.240560+00:00 app[web.1]: npm ERR! There is likely additional logging output above.
  2018-02-01T13:23:25.240249+00:00 app[web.1]: npm ERR! Or if that isn't available, you can get their info via:
  2018-02-01T13:23:25.240375+00:00 app[web.1]: npm ERR!     npm owner ls chat-extensions
  2018-02-01T13:23:25.244425+00:00 app[web.1]:
  2018-02-01T13:23:25.244567+00:00 app[web.1]: npm ERR! Please include the following file with any support request:
  2018-02-01T13:23:25.244632+00:00 app[web.1]: npm ERR!     /app/npm-debug.log
  2018-02-01T13:23:25.310008+00:00 heroku[web.1]: State changed from starting to crashed
  2018-02-01T13:23:25.312764+00:00 heroku[web.1]: State changed from crashed to starting
  2018-02-01T13:23:25.295396+00:00 heroku[web.1]: Process exited with status 1
**/
