import logo from './logo.svg';
import SearchBar from './components/searchbar';
import './App.css';

function App() {
  const mode = "search";
  return (
    <div className="App">
      <SearchBar mode={mode}/>
    </div>
  );
}

export default App;
