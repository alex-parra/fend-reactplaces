import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class PlaceDetail extends React.Component {

  state = {
    error: '',
    venue: null,
    venues: []
  }

  foursquareApi = 'https://api.foursquare.com/v2/'
  foursquareCli = 'YRNWWLW5YQB2HWMKTIURAZW51UWFLNZBRVAUZHYVFWPN520Q'
  foursquareSec = 'ASSGS5VPLJEWBVCJOEBBWQA4AIDRLKVN4YLFIVXANE0NSAHO'

  componentDidMount() {
    const place = this.props.place
    const auth = 'client_id='+ this.foursquareCli +'&client_secret='+ this.foursquareSec +'&v=20180610'
    const latlng = place.lat +','+ place.lng
    const dataFetch = fetch(this.foursquareApi + 'venues/search?'+ auth + '&ll='+ latlng + '&query='+ place.name +'&radius=50&intent=browse')
      .then(resp => {
        if( resp.status !== 200 ) {
          throw new Error('Loading venues from FOURSQUARE failed.')
        }
        return resp.json()
      })
      .then(data => {
        if( !data.response.venues || data.response.venues.length === 0 ) {
          throw new Error('No matches on FOURSQUARE for this location/name.')
        }

        this.setState({venues: data.response.venues})
        const venue = _.head(data.response.venues)
        if( venue !== undefined && venue.id ) {
          return fetch(this.foursquareApi + 'venues/'+ venue.id +'?'+ auth)
        }

        return {status: 404}
      }).then(resp => {
        if( resp.status !== 200 ) {
          throw new Error('Loading venue data from FOURSQUARE failed.')
        }
        return resp.json()
      }).then(data => {
        if( data.response.venue ) {
          this.setState({venue: data.response.venue})
        }
      })

    dataFetch.catch(err => {
      this.setState({error: err.message})
    })
  }

  render() {
    const place = this.props.place
    const venue = this.state.venue
    const hasError = this.state.error && this.state.error.length > 0
    let photo = ''
    if( venue && venue.bestPhoto ) {
      photo = venue.bestPhoto.prefix + venue.bestPhoto.width +'x'+ venue.bestPhoto.height + venue.bestPhoto.suffix
    }

    return (
      <div className="placeDetail">
        <h1>{place.index}. {place.name}</h1>
        {hasError !== true && !venue && <div className="foursquareLoading">Loading info from FOURSQUARE...</div>}

        {hasError === true && <div className="venue-error"><strong>Oh no!</strong><br/>{this.state.error}</div>}

        {hasError !== true && venue &&
          <div className="fourSquareData">
            {photo && <div className="photo" style={{backgroundImage:'url('+ photo +')'}}></div>}
            <ul>
              <li><strong>Name:</strong> {venue.name}</li>
              <li><strong>Type:</strong> {_.get(venue, 'categories[0].name', '- Unknown -')}</li>
              <li><strong>Address:</strong> {_.get(venue, 'location.address', '- Unknown -')}</li>
              <li><strong>Phone:</strong> {_.get(venue, 'contact.formattedPhone', '- Unknown -')}</li>
            </ul>
            <a href={venue.shortUrl} target="_blank">See more at FOURSQUARE ›</a>
          </div>}
      </div>
    )
  }

}

PlaceDetail.propTypes = {
  place: PropTypes.object
}

export default PlaceDetail
