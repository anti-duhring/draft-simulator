import './App.css';
import Body from './components/Wrapper/Body'
import Home from './components/Home';
import { BrowserRouter, Switch, Route, Routes } from 'react-router-dom';
import {DraftContextProvider} from './Context/DraftContext'

function App() {
  return (
    <div className="App">
      <DraftContextProvider>
      <Body>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Body>
      </DraftContextProvider>
    </div>
  );
}

export default App;
