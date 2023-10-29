import logo from './logo.svg';
import SearchBar from './components/searchbar';
import './App.css';

function App() {
  const mode = "search";
  return (
    <div className="App">
      <div className="searchbar">
        <SearchBar mode={mode}/>
      </div>
    </div>
  );
}

export default App;
