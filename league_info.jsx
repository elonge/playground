import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import SocialGroup from 'material-ui/svg-icons/social/group';
import SocialShare from 'material-ui/svg-icons/social/share';
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
import ContentSend from 'material-ui/svg-icons/content/send';

import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import CreateLeagueDialog from './create_league3.jsx';
import JoinLeagueDialog from './join_league.jsx';


const style = {
  float: "right",
  marginTop: "-100px",
};

class LeagueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league: props.league,
      dailyStatMode: props.dailyStatMode,
      createLeagueDialogOpen: false,
      joinLeagueDialogOpen: false,
    };
    this.onPrivateLeagueMenuClick = this.onPrivateLeagueMenuClick.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.onInviteNewLeague = this.onInviteNewLeague.bind(this);
    this.onNewLeague = this.onNewLeague.bind(this);
  }

  // Called when switching leagues
  componentWillReceiveProps(nextProps) {
    this.setState( {
      league: nextProps.league,
      dailyStatMode: nextProps.dailyStatMode,
    });
  }

  onDialogClose() {
    this.setState({joinLeagueDialogOpen:false, createLeagueDialogOpen:false});
    this.props.onDialogClose();
  }

  handleToggle = (event, toggle) => {
    this.props.onDailyStatMode();
  };

  onInviteNewLeague(newLeague) {
    this.setState({joinLeagueDialogOpen:false, createLeagueDialogOpen:false});
    this.props.onInviteNewLeague(newLeague);
  }

  onNewLeague(newLeague) {
    this.setState({joinLeagueDialogOpen:false, createLeagueDialogOpen:false});
    this.props.onNewLeague(newLeague);
  }

  onPrivateLeagueMenuClick(event, value) {
    console.log("onPrivateLeagueMenuClick: " + value);
    if (value == 'new') {
      this.setState({createLeagueDialogOpen:true});
      this.props.onDialogOpen();
    } else if (value == 'join') {
      this.setState({joinLeagueDialogOpen:true});
      this.props.onDialogOpen();
    }
  }

  render() {
    const {
      league,
      dailyStatMode,
      createLeagueDialogOpen,
      joinLeagueDialogOpen,
    } = this.state;

    const creator = this.props.users.find((user) => user.fbId == league.owner_id);
    console.log(league.owner_id + ": " + JSON.stringify(this.props.users));
    let createLeagueDialog = ( createLeagueDialogOpen ?
      <CreateLeagueDialog
        socket={this.props.socket}
        senderId={this.props.viewerId}
        allCompetitions={this.props.allCompetitions}
        onClose={this.onDialogClose}
        onInviteNewLeague={this.onInviteNewLeague}
        onNewLeague={this.onNewLeague}
      />
      : ""
    );

    let joinLeagueDialog = ( joinLeagueDialogOpen ?
      <JoinLeagueDialog
        socket={this.props.socket}
        senderId={this.props.viewerId}
        allCompetitions={this.props.allCompetitions}
        onClose={this.onDialogClose}
        onNewLeague={this.onNewLeague}
      />
      : ""
    );
    let leagueInfoCard = ( (createLeagueDialogOpen || joinLeagueDialogOpen) ? "" :
      <Card expanded={false}>
        <CardHeader
          title={league.league_name}
          subtitle={"Created by " + creator.name}
          avatar={creator.profilePic}
        />
        <CardText>
          <Toggle
            toggled={this.state.dailyStatMode}
            onToggle={this.handleToggle}
            labelPosition="right"
            label={dailyStatMode ? "Daily Winners" : "Weekly League"}
          />
          <IconMenu
            style={style}
            listStyle={{width:"300px"}}
            iconButtonElement={<IconButton><MoreHoriz /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onChange={this.onPrivateLeagueMenuClick}
          >
            <MenuItem primaryText="Private Leagues Menu" disabled={true} style={{color: '#559'}}/>
            <Divider />
            <MenuItem value="share" primaryText="Share League" leftIcon={<SocialShare />}/>
            <MenuItem value="join" primaryText="Join Another League..." leftIcon={<SocialGroup />}/>
            <MenuItem value="new" primaryText="Create a New League..." leftIcon={<ContentAdd />}/>
            <Divider />
            <MenuItem value="leave" primaryText="Leave This League" leftIcon={<ContentRemove />}/>
          </IconMenu>
        </CardText>
      </Card>
    );

    return (
      <div>
      {leagueInfoCard}
      {createLeagueDialog}
      {joinLeagueDialog}
      </div>
    );
  }

}
LeagueInfo.propTypes = {
};

export default LeagueInfo;
