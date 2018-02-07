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
import Badge from 'material-ui/Badge';

import SocialGroup from 'material-ui/svg-icons/social/group';
import EditSettingDialog from './edit_settings.jsx'

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
      editSettingsDialogOpen: false,
    };
    this.onMenuClicked = this.onMenuClicked.bind(this);
    this.onCloseCreateDialog = this.onCloseCreateDialog.bind(this);
    this.onNewLeague = this.onNewLeague.bind(this);
    this.onNewQuestion = this.onNewQuestion.bind(this);
    this.onInviteNewLeague = this.onInviteNewLeague.bind(this);
    this.onLeaguesClicked = this.onLeaguesClicked.bind(this);
    this.onSettingsClicked = this.onSettingsClicked.bind(this);
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

  onSettingsClicked() {
    this.props.onSettingsClicked();
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
    let leaguesDrawerItems = this.state.leagues.map((league) => (
      <MenuItem
        key={league.id}
        value={league.id}
        primaryText={league.league_name}
        checked={league.id == this.state.currentLeague.id}
        onClick={() => this.onChangeLeague(league)}
      />
    ));

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
          <Divider />
          <MenuItem primaryText="Settings..." onClick={() => this.onSettingsClicked()}}/>
        </Drawer>
      </div>
    );

//iconElementLeft={<IconButton><NavigationExpandMore /></IconButton>}
//iconElementLeft={leftButton}

  let leftButton = (
    <Badge
      badgeContent={4}
      secondary={true}
      badgeStyle={{top: 20, right: 20}}
    >
      <IconButton><SocialGroup
        onClick={() => this.onLeaguesClicked()}
        color={'white'}
      /></IconButton>
    </Badge>
  );

  leftButton = (
    <IconButton><SocialGroup
      onClick={() => this.onLeaguesClicked()}
      color={'white'}
    /></IconButton>

  );

  let editSettingsDialog = ( this.state.editSettingsDialogOpen ?
    <EditSettingDialog
      socket={this.props.socket}
      senderId={this.props.viewerId}
      onClose={this.onDialogClose}
      settings={{}}
    />
    : ""
  );

    return (
      <AppBar
        title={this.props.title}
        titleStyle={{fontSize: 18}}
        iconElementRight={rightButton}
        iconElementLeft={leftButton}
        style={{position: 'fixed', top:0}}
        onTitleClick={() => this.onLeaguesClicked()}
        />
    );
  }
}
MainAppBar.propTypes = {
};

export default MainAppBar;
