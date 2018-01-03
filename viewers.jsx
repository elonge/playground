/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import React, {createElement} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Footer, FooterText} from 'react-weui';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SocialPeople from 'material-ui/svg-icons/social/people';
import FormatListNumbered from 'material-ui/svg-icons/editor/format-list-numbered';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const socialStyle = {
  'margin-right' : 50,
};


// Viewers Component — Who has joined the list, and who is viewing it.
const Viewers = ({viewerId, users, onUserClick, viewedUserId}) => {
  if (users.length <= 1) { return null; }

  const {activeCount, viewers} = users.reduce(
    ({activeCount, viewers}, user) => {
      /**
      if (user.fbId === viewerId) {
        return {activeCount, viewers};
      }
      **/

    // Attributes
      const {fbId, online, profilePic} = user;
      const className = `viewer ${viewedUserId==fbId ? 'active' : ''}`;

    // Construct viewer
      const viewer = <img key={fbId} src={profilePic} className={className} onClick={() => onUserClick(user)}/>;

    // Accumulate
      return {
        activeCount: (user.online ? activeCount + 1 : activeCount),
        viewers: viewers.concat(viewer),
      };
    },
    {activeCount: 0, viewers: []}
  );

  return (
    <Card expanded={false}>
      <CardMedia>
        <section id='viewers'>
          <ReactCSSTransitionGroup
            className='viewers-list-cntnr'
            transitionName='viewer'
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {viewers}
          </ReactCSSTransitionGroup>

          <Footer id='viewer-count'>
            <FooterText>
              {viewers.length} people are in the game!
            </FooterText>
          </Footer>
        </section>
        </CardMedia>
    </Card>
  );
};

Viewers.propTypes = {
};

export default Viewers;
