import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class LeagueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league: props.league,
    };
  }

  // Called when switching leagues
  componentWillReceiveProps(nextProps) {
    this.setState( {
      league: nextProps.league
    });
  }


  render() {
    const {
      league
    } = this.state;

    const creator = this.props.users.find((user) => user.fbId === league.creatorId);
    return (
      <Card expanded={false}>
        <CardHeader
          title={league.name}
          subtitle={"Created by " + creator.name}
          avatar={creator.profilePic}
        />
      </Card>
    );
  }

}
LeagueInfo.propTypes = {
};

export default LeagueInfo;
