import messages from './messenger-api-helpers/messages';

const inviteToLeague = (appUri, sharingMode, myName, league) => {
  let userText = messages.textUserCreatedLeague.replace('_USER', myName).replace('_LEAGUE', league.league_name);
  console.log(userText);
  let messageToShare = messages.shareWithConversation(appUri, userText, league.league_code);

  window.MessengerExtensions.beginShareFlow(
    function success(response) {
      if (response.is_sent) {
        window.MessengerExtensions.requestCloseBrowser(null, null);
      }
    }, function error(errorCode, errorMessage) {
      alert('Invite Failed! ' + errorCode +',' + errorMessage);
      console.error({errorCode, errorMessage});
    },
    messageToShare,
    sharingMode);

  console.log(JSON.stringify(messageToShare));
}

const tellNewQuestion = (appUri, sharingMode, myName) => {
  console.log(messages.textUserNewQuestion);
  let userText = messages.textUserNewQuestion.replace('_USER', myName);
  console.log(userText);
  let messageToShare = messages.shareWithConversation(appUri, userText);

  window.MessengerExtensions.beginShareFlow(
    function success(response) {
      if (response.is_sent) {
        window.MessengerExtensions.requestCloseBrowser(null, null);
      }
    }, function error(errorCode, errorMessage) {
      alert('Invite Failed! ' + errorCode +',' + errorMessage);
      console.error({errorCode, errorMessage});
    },
    messageToShare,
    sharingMode);

  console.log(JSON.stringify(messageToShare));
}

export default {
  inviteToLeague,
  tellNewQuestion,
}
