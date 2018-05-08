import React from 'react'
import {Link} from 'react-router-dom'

export default props => {
  return (
    <div className="page-404">
      <h1>Page not found</h1>
      <p><Link to="/">Go to main page</Link></p>
    </div>
  )
}
