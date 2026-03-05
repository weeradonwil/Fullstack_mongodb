import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'


function App() {
  return (
    <div>

      <Routes>
        <Route path='/' elment={<Home />} />
        <Route path='login' elment={<Login />} />

      </Routes>
    

    </div>
  )
}

export default App
