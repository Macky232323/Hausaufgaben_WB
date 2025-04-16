import './App.css';

function App() {

  const zahl = 15
  const name = "Alex"
  const element = <h3>Hallo aus dem H3 tag</h3>
  function addieren(a, b) {
    return a + b}


  return (
    <>
      <h1 style={{ backgroundColor: "red", fontSize: "40px" }}>Hier ist eine Berechnung {zahl * 5}</h1>
      <p>Hallo aus dem P tag</p>
      <h2>Hallo lieber {name}</h2>
      {element}
      <p>{addieren(5,4)}</p>

    </>
  );
}

export default App;