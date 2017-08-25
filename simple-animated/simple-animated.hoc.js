import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

/**
 * The animation hoc need tree state:
 *  • enter
 *  • active
 *  • leave
 * Each state has inline style applied :
 *  • enterStyle
 *  • activeStyle
 *  • leaveStyle
 * The hoc will pass to the base component an animatedStyle props defined as :
 *  1. animatedStyle = enterStyle
 *  2. wait enterTimeout finish
 *  3. animatedStyle = activeStyle
 *  4. wait activeTimeout finish
 *  5. animatedStyle = leaveStyle
 *  6. wait leaveTimeout finish
 *  7. call {Function} onLeave props
 * @param {Object} enterStyle - the style to be applied at the enter of the animation
 * @param {Object} activeStyle - the style to be applied for the active state of the animation
 * @param {Object} leaveStyle - the style to be applied for the leave state of the animation
 * @param {Number} enterTimeout - the time to wait with the enterStyle applied
 * @param {Number} activeTimeout - the time to wait with the activeStyle applied
 * @param {Number} leaveTimeout - the time to wait with the leaveStyle applied and bfore the onLeave props be called
 * @props {Function} onLeave - callback called when the animation is finished.
 * @example
 *  -- MyView.view.jsx
 *  function myView({animatedStyle}){
 *   return <div style={animatedStyle}> Hello world </div>
 *  }
 *
 *  export default animated({
 *   enterStyle : {color: 'blue'},
 *   enterTimeout : 2500,
 *   activeStyle : {color: 'white'},
 *   activeTimeout : 2500,
 *   leaveStyle : {color: 'red'},
 *   leaveTimeout : 2500,
 *  })(MyView)
 *
 *  -- MyView.container.jsx
 *   function MyContainer(){
 *    return <MyView
 *     onLeave={() => console.log('animation is finish')}
 *    />
 *   }
 */
const animatedHoc = ({
  enterStyle={},
  activeStyle={},
  leaveStyle={},
  enterTimeout=1000,
  activeTimeout=1000,
  leaveTimeout=1000,
  }) => BaseComponent => {
  class Animated extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        style: enterStyle
      }
    }

    componentDidMount() {
      let promiseToApplyStyle = new Promise((resolve) => {
        this._activeStyleTimeout = setTimeout(() => this.setState({ style: activeStyle }, resolve), enterTimeout);
      }).then(() => new Promise((resolve) => {
          this._leaveStyleTimeout = setTimeout(() => this.setState({ style: leaveStyle }, resolve), activeTimeout);
        })
      ).then(() => {
        this._onLeaveTimeout = setTimeout(this.props.onLeave, leaveTimeout);
      });
    }

    componentWillunmount() {
      clearTimeout(this._activeStyleTimeout);
      clearTimeout(this._leaveStyleTimeout);
      clearTimeout(this._onLeaveTimeout);
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          animatedStyle={this.state.style}
        />
      );
    }
  }

  Animated.propTypes = {
    onLeave: React.PropTypes.func
  };

  return setDisplayName(wrapDisplayName(BaseComponent, 'animated'))(Animated);
};

export default animatedHoc;
