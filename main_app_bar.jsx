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

//import CreateLeagueDialog from './create_league.jsx';
import CreateLeagueDialog from './create_league2.jsx';


class MainAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPointsMode: props.showPointsMode,
      leagueDialogOpen: false,
      isCreate: false,
      leagues: props.leagues,
    };
    this.onMenuClicked = this.onMenuClicked.bind(this);
    this.onCloseCreateDialog = this.onCloseCreateDialog.bind(this);
    this.onNewLeague = this.onNewLeague.bind(this);
    this.onInviteNewLeague = this.onInviteNewLeague.bind(this);
  }

  // Called when switching points/predictions
  componentWillReceiveProps(nextProps) {
    console.log("leagues: " + JSON.stringify(nextProps.leagues));
    this.setState( {
      showPointsMode: nextProps.showPointsMode,
      leagues: nextProps.leagues,
    });
  }

  onMenuClicked(event, value) {
    console.log(value.key);
    switch (value.key) {
      case "leagues":
        this.setState({leagueDialogOpen: true});
        break;
      default:
    }
  }

  onCloseCreateDialog() {
    this.setState({leagueDialogOpen: false});
  }

  onNewLeague(league) {
    this.props.onNewLeague(league);
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
        <Divider />
        <MenuItem primaryText="Settings..." key="settings"/>
      </IconMenu>
    );

    let modeIcon = ((this.state.showPointsMode ?
      <CheckBox
        onClick={() => this.props.onPredictionsPointsToggle()}
        color={'white'}
      />  :
      <FormatListNumbered
        onClick={() => this.props.onPredictionsPointsToggle()}
        color={'white'}
      /> ));

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
        <IconButton>{modeIcon}
        </IconButton>
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
      </div>
    );

//         iconElementLeft={<IconButton><NavigationExpandMore /></IconButton>}

    return (
      <AppBar
        title={this.props.title}
        titleStyle={{fontSize: 18}}
        iconElementLeft={leftButton}
        iconElementRight={rightButton}
        style={{position: 'fixed', top:0}}
        />
    );
  }
}
MainAppBar.propTypes = {
};

export default MainAppBar;
