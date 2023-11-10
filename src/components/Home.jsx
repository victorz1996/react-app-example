import { useEffect, useState } from "react";
import { app } from "../firebaseCredentials";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";
import Swal from "sweetalert2";

const auth = getAuth(app);
const db = getFirestore(app);
const Home = () => {
  const valorInicial = {
    name: "",
    edad: "",
    profesion: "",
  };

  const userRedux = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [user, setUser] = useState(valorInicial);
  const [users, setUsers] = useState([]);
  const [userSelectedEdit, setUserSelectedEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const captureInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const save = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!userSelectedEdit) {
      try {
        await addDoc(collection(db, "users"), {
          ...user,
        });
        getUsers();
      } catch (error) {
        Swal.fire({
          title: error.name,
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b5ed7",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await setDoc(doc(db, "users", userSelectedEdit.id), {
          ...user,
        });
        getUsers();
      } catch (error) {
        Swal.fire({
          title: error.name,
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b5ed7",
        });
      } finally {
        setIsLoading(false);
      }
    }
    setUser({ ...valorInicial });
    setUserSelectedEdit(null);
  };

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getDocs(collection(db, "users"));
      const docs = [];
      response.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setUsers(docs);
    } catch (error) {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "users", id));
      getUsers();
    } catch (error) {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async (id) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    } catch (error) {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      dispatch(removeUser());
      localStorage.removeItem("userSession");
    } catch (error) {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b5ed7",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userSelectedEdit) {
      getUser(userSelectedEdit.id);
    }
  }, [userSelectedEdit]);
  return (
    <>
      <div style={{ position: "relative" }}>
        <div className="container">
          <p>
            Bienvenido, <strong>{userRedux.email}</strong> Has iniciado sesión
          </p>

          <button className="btn btn-primary" onClick={() => closeSession()}>
            Cerrar sesión
          </button>

          <hr />

          <div className="row">
            <div className="col-md-4">
              <h3 className="text-center mb-3">Ingresar usuario</h3>
              <form onSubmit={save}>
                <div className="card card-body">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control mb-3"
                      name="name"
                      placeholder="ingresar el nombre del usuario"
                      onChange={captureInputs}
                      value={user.name}
                    />
                    <input
                      type="text"
                      className="form-control mb-3"
                      name="edad"
                      placeholder="ingresar la edad del usuario"
                      onChange={captureInputs}
                      value={user.edad}
                    />
                    <input
                      type="text"
                      className="form-control mb-3"
                      name="profesion"
                      placeholder="ingresar la profesion del usuario"
                      onChange={captureInputs}
                      value={user.profesion}
                    />
                  </div>
                  <button className="btn btn-primary">
                    {!userSelectedEdit ? "Guardar" : "Actualizar"}
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-8">
              <h2 className="text-center mb-5">Lista de usuarios</h2>
              <div className="container card">
                <div className="card-body">
                  {Boolean(!users.length) && (
                    <h5 style={{ textAlign: "center" }}>
                      No existen usuarios, por favor cree uno
                    </h5>
                  )}
                  {users.map((user) => (
                    <div key={user.id}>
                      <p>Nombre: {user.name}</p>
                      <p>Edad: {user.edad}</p>
                      <p>Profesion: {user.profesion}</p>

                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUser(user.id)}
                      >
                        Eliminar
                      </button>

                      <button
                        className="btn btn-success m-1"
                        onClick={() => setUserSelectedEdit(user)}
                      >
                        Actualizar
                      </button>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="loader-view">Procesando, por favor espere ...</div>
        )}
      </div>
    </>
  );
};

export default Home;
