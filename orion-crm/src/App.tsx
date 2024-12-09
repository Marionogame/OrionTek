import './App.css'
import 'semantic-ui-css/semantic.min.css'
import {Route,Routes } from "react-router";
import Clients from "./Features/Clients";

function App() {

  return (
<Routes>
<Route path="/" element={<Clients />} />

</Routes>
  )
}

export default App
