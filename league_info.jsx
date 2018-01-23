import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

class LeagueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league: props.league,
      dailyStatMode: props.dailyStatMode,
    };
  }

  // Called when switching leagues
  componentWillReceiveProps(nextProps) {
    this.setState( {
      league: nextProps.league,
      dailyStatMode: nextProps.dailyStatMode,
    });
  }

  handleToggle = (event, toggle) => {
    this.props.onDailyStatMode();
  };

  render() {
    const {
      league,
      dailyStatMode
    } = this.state;

    const creator = this.props.users.find((user) => user.fbId == league.owner_id);
    console.log(league.owner_id + ": " + JSON.stringify(this.props.users));
    return (
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
        </CardText>
      </Card>
    );
  }

}
LeagueInfo.propTypes = {
};

export default LeagueInfo;
