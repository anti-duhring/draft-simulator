import './App.css';
import Body from './components/Wrapper/Body'
import DraftOrder from './pages/DraftOrder';
import DraftPicks from './pages/DraftPicks';
import GeneratedImage from './pages/GeneratedImage';
import { BrowserRouter, Switch, Route, Routes } from 'react-router-dom';
import {DraftContextProvider} from './Context/DraftContext'

function App() {
  return (
    <div className="App">   
      <Body>
        <BrowserRouter>
          <DraftContextProvider>
            <Routes>
              <Route path='/' element={<DraftOrder />} />
              <Route path='/draft' element={<DraftPicks />} />
              <Route path='/myDraft' element={<GeneratedImage />} />
            </Routes>
          </DraftContextProvider>
        </BrowserRouter>
      </Body> 
    </div>
  );
}

export default App;
