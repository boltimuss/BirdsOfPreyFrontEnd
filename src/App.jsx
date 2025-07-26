import './App.css'
import Chart_1 from './Charts/Chart_1.jsx'
import Chart_2 from './Charts/Chart_2.jsx'
import Chart_3 from './Charts/Chart_3.jsx'

function App() {

  return (
    <>
    <div style={{ display: 'flex', flexWrap: 'wrap'}}>
      <div style={{ width: '450px', height: '450px' }}><Chart_1></Chart_1></div>
      <div style={{ width: '450px', height: '450px' }}><Chart_2></Chart_2></div>
      <div style={{ width: '450px', height: '450px' }}><Chart_3></Chart_3></div>
    </div>
    </>
  );

  }

export default App
