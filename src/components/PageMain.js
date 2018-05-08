import React from 'react'

class PageMain extends React.Component {

  mapRef = null
  state = {
    map: null
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = () => this.loadMap()
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOXHjUlR6SCA4No1qdCcWNOnH95xLDkRM&libraries=places';
    document.head.appendChild(script);
  }

  loadMap = () => {
    let map = new window.google.maps.Map(this.mapRef, {
      center: {lat: 40.758896, lng: -73.985130},
      zoom: 12,
      mapTypeId: 'roadmap',
    });
    this.setState(prevState => ({map: map}))
  }

  render() {

    return (
      <div className="page-main">
        <div id="map" ref={el => this.mapRef = el} role="application"></div>
      </div>
    )

  }

} // PageMain

export default PageMain
