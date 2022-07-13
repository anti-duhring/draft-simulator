import './App.css';
import Body from './components/Body'
import DraftOrderContainer from './components/DraftOrder/DraftOrderContainer';

function App() {
  return (
    <div className="App">
      <Body>
        <DraftOrderContainer />
      </Body>
    </div>
  );
}

export default App;
