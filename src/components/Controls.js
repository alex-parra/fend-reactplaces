import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import IconPlus from '../imgs/plus-svg'
import IconMinus from '../imgs/minus-svg'
import IconClose from '../imgs/close-svg'
import PlaceDetail from './PlaceDetail'

class Controls extends React.Component {

  searchInput = null

  // Search input handler. Debounced for performance. Propagate to parent
  handleInputChange = _.debounce(() => {
    const searchQuery = this.searchInput.value.trim()
    this.props.searchHandler && this.props.searchHandler(searchQuery)
  }, 250)

  searchClear = () => {
    this.searchInput.value = ''
    this.searchInput.focus()
    this.props.searchHandler && this.props.searchHandler('')
  }

  // Show/hide the search and places list
  toogleControls = (ev) => {
    this.props.toggleHandler && this.props.toggleHandler(!this.props.showing)
  }

  // Zoom buttons handler. Propagate to parent
  handleZoomChange = (button) => {
    this.props.zoomHandler && this.props.zoomHandler(button)
  }

  // List Place click handler. Propagate to parent
  handlePlaceClick = (place) => {
    this.props.placeHandler && this.props.placeHandler(place.index)
  }

  // Return to Places list (unfocus place)
  handleReturnList = () => {
    this.handlePlaceClick({index: undefined})
  }

  componentDidUpdate() {
    // Remove focus from searchInput if pane is closed
    if( !this.props.showing && this.searchInput ) this.searchInput.blur()
  }

  render() {

    const places = this.props.places
    const placesCssState = !this.props.showing ? 'hide' : 'show'
    const placeIsFocused = this.props.placeFocused > 0
    const placeFocusedData = _.find(this.props.places, {index: this.props.placeFocused})
    const toggleLabel = this.props.showing ? 'Hide Places List' : 'Show Places List'

    return (
      <div className={'places ' + placesCssState}>
        <button className="toggle" onClick={this.toogleControls}><span>{toggleLabel}</span></button>

        {this.props.showing &&
          <React.Fragment>
            <div className="filter">
              {placeIsFocused === true && <button onClick={this.handleReturnList}>return to Places list</button>}

              {placeIsFocused !== true &&
                <div className="search">
                  <input type="text" aria-label="Search places" autoFocus defaultValue={this.props.searchQuery} placeholder="Search..." ref={input => this.searchInput = input} onChange={this.handleInputChange} />
                  <button aria-label="Clear search" onClick={this.searchClear}><IconClose /></button>
                </div>}
            </div>

            {placeIsFocused === true && <PlaceDetail place={placeFocusedData} key={this.props.placeFocused} />}

            {placeIsFocused !== true &&
              places.map(place => (
                <button className="place" onClick={() => this.handlePlaceClick(place)} key={'place-' + place.index}>{place.index}. {place.name}</button>
              ))}
          </React.Fragment>}

        <div className="zoom">
          <button aria-label="Zoom In" onClick={() => this.handleZoomChange('plus')}><IconPlus /></button>
          <button aria-label="Zoom Out" onClick={() => this.handleZoomChange('minus')}><IconMinus /></button>
        </div>
      </div>
    )

  }

}

Controls.propTypes = {
  showing: PropTypes.bool,
  places: PropTypes.array,
  placeFocused: PropTypes.number,
  searchQuery: PropTypes.string,
  searchHandler: PropTypes.func,
  toggleHandler: PropTypes.func,
  zoomHandler: PropTypes.func,
  placeHandler: PropTypes.func,
}

export default Controls
