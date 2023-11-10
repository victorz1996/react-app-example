import { useState } from "react";
import { app } from "../firebaseCredentials";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

const auth = getAuth(app);

const Login = ({ navigate }) => {
  const homeUrl = "/";
  const [registry, setRegistry] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (registry) {
      await register(email, password);
    } else {
      await loger(email, password);
      navigate(homeUrl);
    }
  };

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Swal.fire({
        title: "Registro exitoso",
        text: "Su usuario fue creado, por favor inicie sesión",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
      setRegistry(false);
    } catch (error) {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
    }
  };

  const loger = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(addUser({ email }));
      localStorage.setItem("userSession", JSON.stringify({ email }));
    } catch (error) {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
    }
  };
  return (
    <>
      <div className="row g-0 main-container">
        <div className="col-md-7">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img style={{ height: "100vh" }} src="img/1.jpg" alt="..." />
              </div>
              <div className="carousel-item">
                <img style={{ height: "100vh" }} src="img/2.jpeg" alt="..." />
              </div>
              <div className="carousel-item">
                <img style={{ height: "100vh" }} src="img/3.jpg" alt="..." />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col-md-5 form-container-login">
          <div>
            <h1>{registry ? "Registro" : "Inicio de sesión"}</h1>
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingrese email"
                  id="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingrese contraseña"
                  id="password"
                  required
                />
              </div>
              <button className="btn btn-primary login-btn" type="submit">
                {registry ? "Registrate" : "Inicia sesión"}
              </button>
            </form>
            <div className="form-group">
              <button
                className="btn btn-secondary mt-4 form-control"
                onClick={() => setRegistry(!registry)}
              >
                {registry
                  ? "Ya tienes una cuenta? Inicia Sesión"
                  : "No tienes una cuenta? Registrate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
