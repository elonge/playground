import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import SocialGroupAdd from 'material-ui/svg-icons/social/group-add';
import SocialShare from 'material-ui/svg-icons/social/share';
import MoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
import ContentSend from 'material-ui/svg-icons/content/send';
import {Icon, GIFT_ICONS} from './my_icons.jsx';

import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import CreateLeagueDialog from './create_league3.jsx';
import JoinLeagueDialog from './join_league.jsx';
import EditLeagueDialog from './edit_league.jsx';


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
      editLeagueDialogOpen: false,
    };
    this.onPrivateLeagueMenuClick = this.onPrivateLeagueMenuClick.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.onInviteNewLeague = this.onInviteNewLeague.bind(this);
    this.onNewLeague = this.onNewLeague.bind(this);
    this.onCompetitionsUpdate = this.onCompetitionsUpdate.bind(this);
  }

  // Called when switching leagues
  componentWillReceiveProps(nextProps) {
    console.log("nextProps of LeagueInfo");
    this.setState( {
      league: nextProps.league,
      dailyStatMode: nextProps.dailyStatMode,
    });
  }

  onDialogClose() {
    this.setState({joinLeagueDialogOpen:false, createLeagueDialogOpen:false, editLeagueDialogOpen:false});
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

  onCompetitionsUpdate(league) {
    this.setState({editLeagueDialogOpen:false});
    this.props.onCompetitionsUpdate(league);
  }
  onPrivateLeagueMenuClick(event, value) {
    console.log("onPrivateLeagueMenuClick: " + value);
    if (value == 'new') {
      this.setState({createLeagueDialogOpen:true});
      this.props.onDialogOpen();
    } else if (value == 'join') {
      this.setState({joinLeagueDialogOpen:true});
      this.props.onDialogOpen();
    } else if (value == 'edit') {
      this.setState({editLeagueDialogOpen:true});
      this.props.onDialogOpen();
    } else if (value == 'share') {
      this.props.onInviteNewLeague(this.state.league);
    }
  }

  competitionsRenderer(values) {
    if (values.length == 0) {
      return 'No competitions';
    } else if (values.length == 1) {
      return this.props.allCompetitions.find((competition) => competition.id == values[0]).name;
    } else if (values.length == this.props.allCompetitions.length) {
      return "All competitions";
    } else {
      let first=this.props.allCompetitions.find((competition) => competition.id == values[0]).name;
      let second=this.props.allCompetitions.find((competition) => competition.id == values[1]).name;
      if (values.length == 2) {
        return first+" and "+second;
      } else if (values.length == 3) {
        let third=this.props.allCompetitions.find((competition) => competition.id == values[2]).name;
        return first+", "+second + " and " + third;
      } else {
        return first+", "+second + " and " + (values.length-2) + " other competitions";
      }
    }
  }

  render() {
    const {
      league,
      dailyStatMode,
      createLeagueDialogOpen,
      joinLeagueDialogOpen,
      editLeagueDialogOpen,
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

    let editLeagueDialog = ( editLeagueDialogOpen ?
      <EditLeagueDialog
        socket={this.props.socket}
        senderId={this.props.viewerId}
        allCompetitions={this.props.allCompetitions}
        league={league}
        onClose={this.onDialogClose}
        onCompetitionsUpdate={this.onCompetitionsUpdate}
      />
      : ""
    );


    let leagueInfoCard = ( (createLeagueDialogOpen || joinLeagueDialogOpen || editLeagueDialogOpen) ? "" :
      <Card expanded={false}>
        <CardHeader
          title={league.league_name}
          subtitle={this.competitionsRenderer(league.competitions)}
          subtitleStyle={{width:'200px'}}
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
            <MenuItem value="share" primaryText="Share this league" leftIcon={<SocialShare />}/>
            <MenuItem value="edit" primaryText="Edit competitions..." leftIcon={<Icon icon={GIFT_ICONS['Stadium']} top='0px' margin='12px' left='4px' />}/>
            <Divider />
            <MenuItem value="join" primaryText="Join another league..." leftIcon={<SocialGroupAdd />}/>
            <MenuItem value="new" primaryText="Create a new league..." leftIcon={<ContentAdd />}/>
            {/**<Divider />
            <MenuItem value="leave" primaryText="Leave this league" leftIcon={<ContentRemove />}/> **/}
          </IconMenu>
        </CardText>
      </Card>
    );

    return (
      <div>
      {leagueInfoCard}
      {createLeagueDialog}
      {joinLeagueDialog}
      {editLeagueDialog}
      </div>
    );
  }

}
LeagueInfo.propTypes = {
};

export default LeagueInfo;
