import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { QuickCompiler } from "./components/QuickCompiler";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <QuickCompiler />
    </>
  );
}

export default App;
