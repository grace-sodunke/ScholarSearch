import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import SearchBar from './components/searchbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import QandA from './components/Q&A';
import FileUploadComponent from './components/FileUploadButton';


function App() {
  const [summary, setSummary] = useState('HI this is sample summary');
  const [practiceMode, setPracticeMode] = useState(false);
  const [query, setQuery] = useState('');

  const handlePracticeClick = () => {
    setPracticeMode(true);
  }

  return (
    <div className="App">
      <div className="searchbar">
        <h2>Search in Notes</h2>
        <FileUploadComponent />
        <div className="pad"></div>
        <SearchBar query={query} setQuery={setQuery} setPracticeMode={setPracticeMode}/>
        <div className="pad"></div>
        <div className="buttons-div">
          <Button className="practice-button" 
                  variant="outline-primary"
                  onClick={handlePracticeClick}>
                    Practice with this topic
          </Button>
        </div>
        {summary && !practiceMode && (
          <div>
            <div className="pad"></div>
            <h2>Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
      {practiceMode ? (
        <div className="practice-div">
          <QandA practiceMode={practiceMode} query={query} />
        </div>
      ) : null}
    </div>
  );
}

export default App;
