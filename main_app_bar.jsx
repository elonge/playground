import React from 'react';
import AppBar from 'material-ui/AppBar';
import FormatListNumbered from 'material-ui/svg-icons/editor/format-list-numbered';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import IconButton from 'material-ui/IconButton';
import CheckBox from 'material-ui-icons/CheckBox';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';

class MainAppBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let modeIcon = ((this.props.showPointsMode ?
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
      </div>
    );

    return (
      <AppBar
        title={this.props.title}
        titleStyle={{fontSize: 18}}
        iconElementLeft={<IconButton><NavigationExpandMore /></IconButton>}
        iconElementRight={rightButton}
        style={{position: 'fixed', top:0}}
        />
    );
  }

}
MainAppBar.propTypes = {
};

export default MainAppBar;
