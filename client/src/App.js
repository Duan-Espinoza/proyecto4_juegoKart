import './App.css';
import axios from 'axios';

const apiCall = () => {
  axios.get('/').then((data) => {
    console.log(data);
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My App</h1>
        <button onClick={apiCall}>Make API Call</button>
      </header>
      <p>This is a simple React application.</p>
      <p>Click the button to make an API call.</p>

    </div>
  );
}

export default App;
