import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class GoogleMap extends React.Component {

  mapRef = null
  state = {
    map: null,
    markers: []
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = () => this.loadMap()
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOXHjUlR6SCA4No1qdCcWNOnH95xLDkRM';
    document.head.appendChild(script);
  }

  shouldComponentUpdate(nextProps) {
    // Update the visible markers. Only if places count changed
    if( this.state.markers && this.props.places.length !== nextProps.places.length ) {
      this.state.markers.forEach(m => {
        const p = _.find(nextProps.places, {index: m.index})
        m.marker.setVisible(p !== undefined)
      })
    }

    // Update Map Zoom. Only if zoom is different
    if( this.state.map && this.state.map.getZoom() !== nextProps.zoom ) {
      this.state.map.setZoom(nextProps.zoom)
    }

    // Set the focused marker. Only when it changed.
    if( nextProps.placeFocused && this.props.placeFocused !== nextProps.placeFocused ) {
      const markerActiveImg = require('../imgs/focused.svg')
      const markerActiveImgSize = new window.google.maps.Size(48, 48)
      const m = _.find(this.state.markers, {index: nextProps.placeFocused})
      this.resetFocusedMarker()
      if( m !== undefined ) {
        m.defaultIcon = m.marker.getIcon()
        m.marker.setIcon({url: markerActiveImg, size: markerActiveImgSize, scaledSize: markerActiveImgSize})
        this.state.map.panTo(m.marker.getPosition())
      }
    } else if( nextProps.placeFocused === undefined ) {
      // If focusedMarker is undefined, clear all
      this.resetFocusedMarker()
    }

    // Component never need to update. Only the map does.
    return false
  }

  loadMap = () => {
    const MapComp = this
    const gMaps = window.google.maps
    const mapBounds = new gMaps.LatLngBounds()
    const markers = []

    const map = new gMaps.Map(this.mapRef, {
      zoom: this.props.zoom,
      mapTypeId:'roadmap',
      mapTypeControl: false,
      scaleControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
    })

    // Create marker for each place
    this.props.places.forEach(place => {
      let placeLatLng = new gMaps.LatLng(place.lat, place.lng)
      const placeMarker = new gMaps.Marker({map:map, position:placeLatLng, label: '' + place.index, animation:gMaps.Animation.DROP, custom_place:place.index})
      placeMarker.addListener('click', function() {
        // If there's a maker handler, call it
        MapComp.props.markerClickHandler && MapComp.props.markerClickHandler(this.custom_place)
      })
      markers.push({index:place.index, marker:placeMarker})
      mapBounds.extend(placeLatLng)
    })

    // Adjust the map center to the markers center
    map.setCenter(mapBounds.getCenter())

    // Store map and markers for reuse
    this.setState(prevState => ({map, markers}))

    // Clicking on the map should clear focused marker
    gMaps.event.addListener(map, 'click', () => {
      this.props.mapClickHandler && this.props.mapClickHandler()
    })

    // Sync map zoom when zoom by scroll with parent comp zoom state
    gMaps.event.addListener(map, 'zoom_changed', _.debounce(() => {
      this.props.mapZoomHandler && this.props.mapZoomHandler(this.state.map.getZoom())
    }, 100))

    // Adjust map on resize
    gMaps.event.addDomListener(window, 'resize', (function(){
      const mapCenter = this.state.map.getCenter()
      gMaps.event.trigger(this.state.map, 'resize')
      this.state.map.setCenter(mapCenter)
    }).bind(this))
  }

  // Restore default icon to all markers
  resetFocusedMarker = () => {
    if( this.state.markers && this.state.markers.length !== 0 ) {
      for( const m of this.state.markers ) {
        m.marker.setIcon(m.defaultIcon)
      }
    }
  }

  render() {
    return (
      <div id="map" ref={el => this.mapRef = el} role="application"></div>
    )
  }

} // class GoogleMap


GoogleMap.propTypes = {
  zoom: PropTypes.number,
  places: PropTypes.array,
  placeFocused: PropTypes.number,
  mapClickHandler: PropTypes.func,
  mapZoomHandler: PropTypes.func,
}

export default GoogleMap
