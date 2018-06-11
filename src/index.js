import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import initReactFastclick from 'react-fastclick'
import './index.css'
import App from './App'

initReactFastclick()

ReactDOM.render(<Router><App /></Router>, document.getElementById('app'))

registerServiceWorker()
