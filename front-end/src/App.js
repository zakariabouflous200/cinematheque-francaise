import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/NavBar';
import MoviesList from './components/MoviesList';
import MyListPage from './components/myListPage'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mylist" element={<MyListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
