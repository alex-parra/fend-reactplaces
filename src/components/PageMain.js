import React from 'react'
import _ from 'lodash'
import GoogleMap from './GoogleMap'
import Controls from './Controls'
import MyPlaces from '../MyPlaces'

class PageMain extends React.Component {

  state = {
    zoom: 11,
    places: [],
    placeFocused: null,
    showControls: false,
    searchQuery: ''
  }

  componentDidMount() {
    MyPlaces.load().then(places => {
      this.setState({places: places})
    })
  }

  // set places shown to those that match the search query
  searchHandler = (search) => {
    this.setState({searchQuery: search})
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
    const searchRegex = new RegExp(_.escapeRegExp(this.state.searchQuery), 'i')
    const placesShown = _.filter(this.state.places, p => searchRegex.test(_.deburr(p.name)))
    return (
      <div className="page-main">
        {this.state.places.length > 0 ?
          <React.Fragment>
            <Controls showing={this.state.showControls} places={placesShown} searchQuery={this.state.searchQuery} searchHandler={this.searchHandler} zoomHandler={this.adjustZoom} placeHandler={this.focusPlace} placeFocused={this.state.placeFocused} toggleHandler={this.showControlsHandler} />
            <GoogleMap places={placesShown} zoom={this.state.zoom} placeFocused={this.state.placeFocused} mapClickHandler={this.focusPlace} mapZoomHandler={this.mapZoomHandler} markerClickHandler={this.focusPlace} />
          </React.Fragment>
          :
          <div className="loading">Loading...</div>
        }
      </div>
    )
  }

} // class PageMain

export default PageMain
