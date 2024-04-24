import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import Header from './Header.jsx'
import Nav from './Nav.jsx'
import Body from './Body.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Nav />
      <Body />
    </>
  )
}

export default App
