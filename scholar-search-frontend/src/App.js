import logo from './logo.svg';
import SearchBar from './components/searchbar';
import './App.css';

function App() {
  const mode = "search";
  return (
    <div className="App">
      <div className="searchbar">
        <h2>Search</h2>
        <SearchBar mode={mode}/>
      </div>
    </div>
  );
}

export default App;
