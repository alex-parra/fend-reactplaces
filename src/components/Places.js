import React from 'react'
import _ from 'lodash'

class Places extends React.Component {

  searchInput = null
  state = {
    hidden: false,
    searchQuery: ''
  }

  handleInputChange = _.debounce(() => {
    this.props.searchHandler && this.props.searchHandler(this.searchInput.value.trim())
  }, 250)

  tooglePlaces = (ev) => {
    this.setState(prevState => ({hidden:!prevState.hidden}))
  }

  render() {

    const placesListClass = (this.state.hidden) ? 'hide' : 'show'

    return (
      <div className={'places ' + placesListClass}>
        <div className="filter">
          <input type="text" autoFocus defaultValue={this.state.searchQuery} placeholder="Search..." ref={input => this.searchInput = input} onChange={this.handleInputChange}/>
        </div>

        <button onClick={this.tooglePlaces}>Close</button>

        {this.props.places.map(place => (
          <div className="place" key={place.name}>{place.name}</div>
        ))}
      </div>
    )

  }

}

export default Places
