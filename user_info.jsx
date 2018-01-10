import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {red500, red200, lime300, lightGreen200,green300,green500, blue500, indigo50, indigo100} from 'material-ui/styles/colors';
import CancelButton from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';

const pointColors = [red500, red200, lime300, lightGreen200, green300, green500];
const pointAvatarStyle = {
  'margin-left' : 4,
};

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      expanded: props.expanded,
      isMe: props.isMe,
    };
  }

  // Called when switching leagues
  componentWillReceiveProps(nextProps) {
    this.setState( {
      user: nextProps.user,
      expanded: nextProps.expanded,
      isMe: nextProps.isMe
    });
  }

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleCancelClick = (expanded) => {
    //this.setState({expanded: expanded});
    this.props.onUserInfoCancel();
  };

  render() {
    const {
      user
    } = this.state;

    let totalPointsItem = (
      <ListItem
        primaryText={user.moreFields.sum + " total points"}
        leftAvatar={
          <Avatar src="media/total_points.png" backgroundColor={'white'} />
        }
      />
    );
    let numWinnerItem = (user.moreFields.count == 0 || user.moreFields.count == null) ? "" : (
      <ListItem
        primaryText={user.moreFields.count + " time" + (user.moreFields.count == 1 ? '' : 's') + " league winner"}
        leftAvatar={
          <Avatar src="media/winner_icon.png" backgroundColor={'white'} />
        }
      />
    );

    let successPctItem =  (
      <ListItem
        primaryText={Math.round(user.moreFields.avg * 100) + "% success rate"}
        leftAvatar={
          <Avatar src="media/percentage.png" backgroundColor={'white'} />
        }
      />
    );

    let avatars = user.moreFields.lastDaysPoints.split('').map((char, index) =>
      <Avatar key={index} size={20} style={pointAvatarStyle} backgroundColor={pointColors[char]}>{char}</Avatar>
    );

    let avatarsDiv = (
      <div>Recent performance
        {avatars}
      </div>
    );
    let lastDaysItem =  (
      <ListItem
        primaryText={avatarsDiv}
        leftAvatar={
          <Avatar src="media/last_days.png"  backgroundColor={'white'} />
        }
      />
    );

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleCancelClick}>
        <CardHeader
          title={user.name}
          subtitle={"Joined in " + new Date(user.moreFields.joinedDate).toLocaleDateString()}
          avatar={user.profilePic}
          actAsExpander={true}
          showExpandableButton={!this.state.isMe}
          closeIcon={<CancelButton/>}
          openIcon={<CancelButton/>}
        />
        <CardText>
          <Toggle
            toggled={this.state.expanded}
            onToggle={this.handleToggle}
            labelPosition="right"
            label={this.state.expanded ? "Hide stats" : "Show stats"}
          />
        </CardText>
        <CardText expandable={true}>
          <List>
            {totalPointsItem}
            {numWinnerItem}
            {successPctItem}
            {lastDaysItem}
          </List>
        </CardText>
      </Card>
    );
  }

}
UserInfo.propTypes = {
};

export default UserInfo;
