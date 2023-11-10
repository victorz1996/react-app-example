import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import { Route, Routes, useNavigate } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user);

  return (
    <>
      <div>
        <Routes>
          <Route path="/login" element={<Login navigate={navigate} />}></Route>
          <Route
            path="/"
            element={
              <ProtectedRoute isAllowed={Boolean(userRedux.email)}>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="*" element={<h1>Esta pagina no existe</h1>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
