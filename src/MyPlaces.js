import _ from 'lodash'

const MyPlaces = {

  // Load the places from json, sort them by name, add index to each
  load: () => {
    return fetch('places.json').then(resp => resp.json()).then(data => {
      const myPlaces = _.orderBy(data, 'name')
      let index = 1
      myPlaces.forEach(p => { p.index = index++ })
      return myPlaces
    })
  }

}

export default MyPlaces
