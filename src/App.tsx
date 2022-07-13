import Employees from './component/Employees';
import NewEmployee from './component/NewEmployee';

function App() {
  return (
    <div className="App">
      <div className='row'>
        <div className="container">
          <Employees/>
        </div>

        <div className="container">
    <NewEmployee/>
        </div>

      </div>
      
    </div>
  );
}

export default App;
