import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Otp from './pages/otp'
import MyProfile from './pages/myprofile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login"  element={<Login/>}/>
        <Route path="/otp"  element={<Otp/>}/>
        <Route path="/me"  element={<MyProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App 



