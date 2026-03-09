import './storage-polyfill.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import NanuAmbassadorHub from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NanuAmbassadorHub />
  </React.StrictMode>,
)
