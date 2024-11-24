import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Inbox from "./Pages/Inbox";
// import Unread from "./Pages/Unread";
// import Starred from "./Pages/Starred";
// import Draft from "./Pages/Draft";
// import Sent from "./Pages/Sent";
// import Archive from "./Pages/Archive";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <Routes>
        {/* Redirect to /home after login, otherwise show login page */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/home/inbox" /> : <Login />} />

        {/* Home route where all nested routes will be loaded */}
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />}>
          <Route path="inbox" element={<Inbox />} />
          {/* <Route path="unread" element={<Unread />} />
          <Route path="starred" element={<Starred />} />
          <Route path="draft" element={<Draft />} />
          <Route path="sent" element={<Sent />} />
          <Route path="archive" element={<Archive />} /> */}
        </Route>

        {/* If the user is not logged in, navigate them to the login page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
