import React from 'react'
import {Switch, Route} from 'react-router-dom'
import PageMain from './components/PageMain'
import Page404 from './components/Page404'

class App extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={PageMain} />
        <Route component={Page404} />
      </Switch>
    );
  }

} // class App

export default App;
