import './App.css';
import Body from './components/Wrapper/Body'
import DraftOrder from './pages/DraftOrder';
import DraftPicks from './pages/DraftPicks';
import GeneratedImage from './pages/GeneratedImage';
import { BrowserRouter, Switch, Route, Routes } from 'react-router-dom';
import {DraftContextProvider} from './Context/DraftContext'
import Footer from './components/Footer';
import Adsense from './components/Adsense';

function App() {
  return (
    <div className="App"> 
      <Body>
      <Adsense />
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
      <Footer />
    </div>
  );
}

export default App;
