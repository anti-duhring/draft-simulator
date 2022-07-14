import './App.css';
import Body from './components/Wrapper/Body'
import Home from './components/Home';
import { BrowserRouter, Switch, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Body>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Body>
    </div>
  );
}

export default App;
