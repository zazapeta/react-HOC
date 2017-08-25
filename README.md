# react-HOC
List of usefull react High Order Component : 

### Simple-animated :
* Link : [simple-animated](./simple-animated)
* Description : add 3 states to a view (enter, active, leave + onLeave) based on timeout and a simple api than ReactCSSTransition (and with inline style).
* Example preview : 
> MyView.view.jsx
```javascript
import animated from './simple-animated'

function myView({animatedStyle}){
    return <div style={animatedStyle}> Hello world </div>
}
export default animated({
    enterStyle : {color: 'blue'},
    enterTimeout : 2500,
    activeStyle : {color: 'white'},
    activeTimeout : 2500,
    leaveStyle : {color: 'red'},
    leaveTimeout : 2500
})(MyView)
``` 
> MyView.container.jsx
```javascript
import MyView from './MyView.view.jsx';

function MyContainer(){
  return <MyView
            onLeave={() => console.log('animation is over')}
          />
}
```
