import React from 'react';
import AppBar from 'material-ui/AppBar';
import FormatListNumbered from 'material-ui/svg-icons/editor/format-list-numbered';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import CheckBox from 'material-ui-icons/CheckBox';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import SocialGroup from 'material-ui/svg-icons/social/group';

//import CreateLeagueDialog from './create_league.jsx';
import CreateLeagueDialog from './create_league2.jsx';
import LeagueQuestionsDialog from './league_questions.jsx';


class MainAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPointsMode: props.showPointsMode,
      leagueDialogOpen: false,
      questionDialogOpen: false,
      isCreate: false,
      leagues: props.leagues,
      leaguesDrawerOpen: false,
      currentLeague: props.currentLeague,
    };
    this.onMenuClicked = this.onMenuClicked.bind(this);
    this.onCloseCreateDialog = this.onCloseCreateDialog.bind(this);
    this.onNewLeague = this.onNewLeague.bind(this);
    this.onNewQuestion = this.onNewQuestion.bind(this);
    this.onInviteNewLeague = this.onInviteNewLeague.bind(this);
    this.onLeaguesClicked = this.onLeaguesClicked.bind(this);
  }

  // Called when switching points/predictions
  componentWillReceiveProps(nextProps) {
    console.log("leagues: " + JSON.stringify(nextProps.leagues));
    this.setState( {
      showPointsMode: nextProps.showPointsMode,
      leagues: nextProps.leagues,
      currentLeague: nextProps.currentLeague,
    });
  }

  onMenuClicked(event, value) {
    console.log(value.key);
    switch (value.key) {
      case "leagues":
        this.setState({leagueDialogOpen: true});
        break;
      case "questions":
        this.setState({questionDialogOpen: true});
      default:
    }
  }

  onChangeLeague(league) {
    this.props.onCurrentLeagueChanged(league);
    this.setState({leaguesDrawerOpen:false});
  }

  onLeaguesClicked() {
    this.setState({leaguesDrawerOpen: !this.state.leaguesDrawerOpen});
  }

  onCloseCreateDialog() {
    this.setState({leagueDialogOpen: false});
  }

  onNewLeague(league) {
    this.props.onNewLeague(league);
  }

  onNewQuestion(toShare, questionInfo) {
    console.log("toShare=" + toShare);
    this.props.onNewQuestion(toShare, questionInfo);
  }

  onInviteNewLeague(league) {
    this.props.onInviteNewLeague(league);
  }

  render() {

    let leftButton = (
      <IconMenu
        iconButtonElement={
          <IconButton><NavigationExpandMore /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        onItemClick={this.onMenuClicked}
      >
        <MenuItem primaryText="Private Leagues..." key="leagues" />
        <MenuItem primaryText="Add Questions..." key="questions" />
        <Divider />
        <MenuItem primaryText="Settings..." key="settings"/>
      </IconMenu>
    );

    let leaguesDialog = (
      <CreateLeagueDialog
        open={this.state.leagueDialogOpen}
        isCreate={this.state.isCreate}
        handleClose={this.onCloseCreateDialog}
        socket={this.props.socket}
        senderId={this.props.senderId}
        onNewLeague={this.onNewLeague}
        onInviteNewLeague={this.onInviteNewLeague}
        leagues={this.state.leagues}
        users={this.props.users}
      />
    );

    let leaguesDrawerItems = this.state.leagues.map((league) => (
      <MenuItem
        key={league.id}
        value={league.id}
        primaryText={league.league_name}
        checked={league.id == this.state.currentLeague.id}
        onClick={() => this.onChangeLeague(league)}
      />
    ));

    console.log("this.state.questionDialogOpen=" +this.state.questionDialogOpen);
    let questionsDialog = (
      <LeagueQuestionsDialog
        open={this.state.questionDialogOpen}
        socket={this.props.socket}
        senderId={this.props.senderId}
        onNewQuestion={this.onNewQuestion}
      />
    );

    let modeIcon = (this.state.showPointsMode ?
      <CheckBox
        onClick={this.props.disabled ? "" : () => this.props.onPredictionsPointsToggle()}
        color={'white'}
      />  :
      <FormatListNumbered
        onClick={this.props.disabled ? "" : () => this.props.onPredictionsPointsToggle()}
        color={'white'}
      /> );

    let rightButton = (
      <div>
        <IconButton disabled={this.props.isPrevDisabled()}><KeyboardArrowLeft
          onClick={() => this.props.onPrevClick()}
          color={'white'}
        /></IconButton>
        <IconButton disabled={this.props.isNextDisabled()}><KeyboardArrowRight
          onClick={() => this.props.onNextClick()}
          color={'white'}
        /></IconButton>
        <IconButton disabled={this.props.disabled}>{modeIcon}
        </IconButton>
        <Drawer open={this.state.leaguesDrawerOpen} docked={false}>
          <MenuItem primaryText="Your Leagues" disabled={true} style={{color: '#559'}}/>
          <Divider />
          {leaguesDrawerItems}
        </Drawer>
        {/*leaguesDialog*/}
        {/*questionsDialog*/}
      </div>
    );

//iconElementLeft={<IconButton><NavigationExpandMore /></IconButton>}
//iconElementLeft={leftButton}

    return (
      <AppBar
        title={this.props.title}
        titleStyle={{fontSize: 18}}
        iconElementRight={rightButton}
        iconElementLeft={<IconButton><SocialGroup
          onClick={() => this.onLeaguesClicked()}
          color={'white'}
          /></IconButton>}
        style={{position: 'fixed', top:0}}
        />
    );
  }
}
MainAppBar.propTypes = {
};

export default MainAppBar;
