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


**/
