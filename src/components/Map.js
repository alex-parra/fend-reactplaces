import React from 'react'
import _ from 'lodash'

class Map extends React.Component {

  mapRef = null
  state = {
    map: null,
    markers: null
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = () => this.loadMap()
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOXHjUlR6SCA4No1qdCcWNOnH95xLDkRM';
    document.head.appendChild(script);
  }

  shouldComponentUpdate(nextProps) {
    this.state.markers && this.state.markers.forEach(m => {
      const p = _.find(nextProps.places, {name: m.name})
      m.marker.setVisible(p !== undefined)
    })
    return false
  }

  loadMap = () => {
    const gMaps = window.google.maps
    const mapBounds = new gMaps.LatLngBounds()
    const markers = []

    const map = new gMaps.Map(this.mapRef, {
      mapTypeId:'roadmap',
      mapTypeControl: false,
      scaleControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      zoomControlOptions: {position: gMaps.ControlPosition.TOP_LEFT},
    })

    this.props.places.forEach(place => {
      let placeLatLng = new gMaps.LatLng(place.lat, place.lng)
      const placeMarker = new gMaps.Marker({map:map, position:placeLatLng, animation:gMaps.Animation.DROP})
      markers.push({name:place.name, marker:placeMarker})
      mapBounds.extend(placeLatLng)
    })

    map.setCenter(mapBounds.getCenter())
    map.fitBounds(mapBounds)

    this.setState(prevState => ({map, markers}))

    gMaps.event.addDomListener(window, 'resize', (function(){
      const mapCenter = this.state.map.getCenter()
      gMaps.event.trigger(this.state.map, 'resize')
      this.state.map.setCenter(mapCenter)
    }).bind(this))
  }

  render() {

    return (
      <div id="map" ref={el => this.mapRef = el} role="application"></div>
    )

  }

}

export default Map
