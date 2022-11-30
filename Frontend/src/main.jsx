import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles.css'
import 'animate.css';
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  <CookiesProvider>
    <App />
  </CookiesProvider>
  //</React.StrictMode>
)
