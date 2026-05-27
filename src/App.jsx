import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import LandingPage from './pages/LandingPage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'
import HomePage     from './pages/HomePage'
import CameraPage   from './pages/CameraPage'
import ResultPage   from './pages/ResultPage'

export default function App() {
  const [user, setUser]       = useState(undefined) // undefined = loading
  const [result, setResult]   = useState(null)      // scan result passed between pages

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  if (user === undefined) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}>
        <div className="big-spinner" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/"        element={!user ? <LandingPage /> : <Navigate to="/home" />} />
      <Route path="/login"   element={!user ? <LoginPage />   : <Navigate to="/home" />} />
      <Route path="/signup"  element={!user ? <SignupPage />  : <Navigate to="/home" />} />
      <Route path="/home"    element={user  ? <HomePage />    : <Navigate to="/" />} />
      <Route path="/camera"  element={user  ? <CameraPage setResult={setResult} /> : <Navigate to="/" />} />
      <Route path="/result"  element={user  ? <ResultPage result={result} />       : <Navigate to="/" />} />
    </Routes>
  )
}
