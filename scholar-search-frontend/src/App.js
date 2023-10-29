import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import SearchBar from './components/searchbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const mode = "search";
  return (
    <div className="App">
      <div className="searchbar">
        <h2>Search</h2>
        <div className="pad"></div>
        <SearchBar mode={mode}/>
        <div className="pad"></div>
        <div className="practice-button-div">
          <Button className="practice-button" variant="outline-primary">Practice with this topic</Button>
        </div>
        
      </div>
    </div>
  );
}

export default App;
