import React from 'react'
import _ from 'lodash'
import GoogleMap from './GoogleMap'
import Controls from './Controls'
import MyPlaces from '../MyPlaces'

class PageMain extends React.Component {

  // Store the original, full list of places
  allPlaces = []

  state = {
    zoom: 11,
    placesShown: [],
    placeFocused: null,
    showControls: false
  }

  componentDidMount() {
    MyPlaces.load().then(places => {
      this.allPlaces = places
      this.setState({placesShown: places})
    })
  }

  // set places shown to those that match the search query
  filterPlaces = (search) => {
    var searchRegex = new RegExp(_.escapeRegExp(search), 'i');
    this.setState({placeFocused: undefined, placesShown: _.filter(this.allPlaces, p => searchRegex.test(_.deburr(p.name)))})
  }

  // Change map zoom. Callback of zoom buttons click
  adjustZoom = (buttonKey) => {
    this.setState(prevState => {
      let nextZoom = prevState.zoom += (buttonKey === 'plus') ? 1 : -1
      return {zoom: Math.min(Math.max(nextZoom, 5), 20)}
    })
  }

  // Set the selected Place as focused
  focusPlace = (placeIndex) => {
    if( placeIndex ) this.showControlsHandler(true)
    this.setState({placeFocused: placeIndex})
  }

  // Map can be zoomed with scroll. When that happens, keep it synced here.
  mapZoomHandler = (mapZoom) => {
    this.setState({zoom: mapZoom})
  }

  // Show/hide the side pane
  showControlsHandler = (show) => {
    this.setState({showControls: show})
  }

  render() {
    return (
      <div className="page-main">
        {this.allPlaces.length > 0 &&
          <GoogleMap places={this.state.placesShown} zoom={this.state.zoom} placeFocused={this.state.placeFocused} mapClickHandler={this.focusPlace} mapZoomHandler={this.mapZoomHandler} markerClickHandler={this.focusPlace} />
        }
        <Controls showing={this.state.showControls} places={this.state.placesShown} searchHandler={this.filterPlaces} zoomHandler={this.adjustZoom} placeHandler={this.focusPlace} placeFocused={this.state.placeFocused} toggleHandler={this.showControlsHandler} />
      </div>
    )
  }

} // class PageMain

export default PageMain
