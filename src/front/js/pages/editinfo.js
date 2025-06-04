import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditInfo = () => {
  const { store, actions } = useContext(Context);

  const [nombre, setNombre] = useState("");
  const [tipo_local, setTipo_local] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const editInfo = (e) => {
    e.preventDefault();
    const id = store.profileRestaurante?.id;
    actions.modificarDatos(id, nombre, tipo_local, descripcion);
  };

  useEffect(() => {
    actions.getInformationCurrentRestaurant();
  }, []);

  return (
    <div className="background">
      {store.auth &&
      store.auth !== "" &&
      store.auth !== undefined &&
      localStorage.getItem("esLocal") ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <form onSubmit={editInfo}>
            <div
              className="p-5"
              style={{
                width: "800px",
                backgroundColor: "rgb(247, 230, 173)",
                borderRadius: "20px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              <h2 className="text-center mb-4">Editar Información</h2>

              <div className="mb-4">
                <label className="form-label fs-5">Nombre</label>
                <input
                  type="text"
                  className="form-control fs-5 py-3"
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fs-5">Tipo de local</label>
                <input
                  type="text"
                  className="form-control fs-5 py-3"
                  onChange={(e) => setTipo_local(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fs-5">Nueva descripción</label>
                <input
                  type="text"
                  className="form-control fs-5 py-3"
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                onClick={() => window.location.reload()}
                className="btn w-100 py-3 fs-5"
                style={{
                  backgroundColor: "rgb(255, 200, 67)",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Modificar Datos
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="div-err-login text-center">
          <h2>¡Primero deberías registrarte!</h2>
          <Link
            className="btn btn-sm m-3"
            style={{
              backgroundColor: "rgb(255, 200, 67)",
              color: "black",
            }}
            to="/"
          >
            Volver al Inicio
          </Link>
        </div>
      )}
    </div>
  );
};
