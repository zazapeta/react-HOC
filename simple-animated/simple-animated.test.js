import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Promise from 'bluebird';

import animated from './simple-animated.hoc';

function assertHasProps(component, props) {
  const componentProps = component.props();
  props.forEach((prop) => {
    if (typeof prop === 'string') {
      assert.isDefined(componentProps[prop], `${component.displayName}.props.${prop} property should exist`);
    } else if (typeof prop === 'object') {
      let {key: propKey, value: propValue} = prop;
      assert.equal(
        componentProps[propKey],
        propValue,
        `${component.displayName}.props.${propKey} property should exist and should be equal to ${propValue}`
      );
    }
  })
}

describe('animated', function () {
  it('Should apply animatedStyle to the wrapped component and call onLeave at the end of animation', (done) => {
    const Dummy = ({animatedStyle}) => <div style={animatedStyle}>dummy</div>;
    const animationCfg = {
      enterStyle   : { color: 'blue' },
      enterTimeout : 1000,
      activeStyle  : { color: 'white' },
      activeTimeout: 1000,
      leaveStyle   : { color: 'red' },
      leaveTimeout : 1000
    };
    const DummyAnimated = animated(animationCfg)(Dummy);
    const dummyAnimatedOnLeaveSpy = sinon.spy();
    const wrapper = mount(<DummyAnimated onLeave={dummyAnimatedOnLeaveSpy}/>);
    assert.isOk(wrapper);
    assertHasProps(wrapper, ['onLeave']);
    assertHasProps(wrapper.find(Dummy), [{ key: 'animatedStyle', value: animationCfg.enterStyle }]);
    Promise.delay(animationCfg.enterTimeout)
      .then(() => assertHasProps(wrapper.find(Dummy), [{ key: 'animatedStyle', value: animationCfg.activeStyle }]))
      .delay(animationCfg.activeTimeout)
      .then(() => assertHasProps(wrapper.find(Dummy), [{ key: 'animatedStyle', value: animationCfg.leaveStyle }]))
      .delay(animationCfg.leaveTimeout)
      .delay(0) // wait event loop
      .then(() => assert.isTrue(dummyAnimatedOnLeaveSpy.calledOnce, 'onLeave should be called once at the end of animation'))
      .then(() => done())
      .catch(done);
  });
});
