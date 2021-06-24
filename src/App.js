import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

// internal import
import Main from "./Main";

function App() {
  const [roomId, setRoomId] = useState();

  useEffect(() => {
    setRoomId(uuidv4());
  }, []);
  return (
    <>
      <Router>
        <Redirect path="*" to={`${roomId}`} />
        {/* <Route component={<Main roomId={roomId} />}></Route> */}
      </Router>
      <Main roomId={roomId} />
    </>
  );
}

export default App;
