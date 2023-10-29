import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import SearchBar from './components/searchbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [summary, SetSummary] = useState('');

  return (
    <div className="App">
      <div className="searchbar">
        <h2>Search in Notes</h2>
        <div className="pad"></div>
        <SearchBar/>
        <div className="pad"></div>
        <div className="practice-button-div">
          <Button className="practice-button" variant="outline-primary">Practice with this topic</Button>
          <Button className="search-history-button" variant="outline-primary">Search History</Button>
        </div>
        <div className='summary'>
        </div>
      </div>
    </div>
  );
}

export default App;
