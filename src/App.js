import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Inbox from "./Pages/Inbox";
import Unread from "./Pages/Unread";
// import Starred from "./Pages/Starred";
// import Draft from "./Pages/Draft";
import Send from "./Pages/Send";
// import Archive from "./Pages/Archive";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <Routes>

        <Route path="/" element={isLoggedIn ? <Navigate to="/home/inbox" /> : <Login />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />}>
          <Route path="inbox" element={<Inbox />} />
          <Route path="unread" element={<Unread />} />
          <Route path="send" element={<Send />} />
          {/* 
          <Route path="starred" element={<Starred />} />
          <Route path="draft" element={<Draft />} />
          
          <Route path="archive" element={<Archive />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
