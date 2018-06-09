import React from 'react'
import _ from 'lodash'
import Map from './Map'
import Places from './Places'
import allPlaces from '../places-list'

class PageMain extends React.Component {

  state = {
    placesShown: allPlaces
  }

  filterPlaces(search) {
    var searchRegex = new RegExp(_.escapeRegExp(search), 'i');
    this.setState({placesShown: _.filter(allPlaces, p => searchRegex.test(_.deburr(p.name)))})
  }

  render() {

    return (
      <div className="page-main">
        <Map places={this.state.placesShown} />
        <Places places={this.state.placesShown} searchHandler={this.filterPlaces.bind(this)} />
      </div>
    )

  }

} // PageMain

export default PageMain
