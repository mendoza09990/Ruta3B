import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "./../../styles/card.css";

export const CardHome = ({
  id,
  nombre,
  descripcion,
  tipo_local,
  foto,
  index,
}) => {
  const { store, actions } = useContext(Context);

  return (
    <div className="myborder d-flex flex-column flex-md-row align-items-center">
      <img className="card-image w-100 w-md-50" src={foto} alt={nombre} />

      <div className="card-content w-100 w-md-50">
        <h2 className="card-title">{nombre}</h2>
        <hr />
        <p className="card-subtitle">Tipo de local: {tipo_local}</p>
        <p>{descripcion}</p>

        <div className="card-buttons mt-3">
          <button
            onClick={() => actions.addFavorite(id)}
            className="btn btn-outline-success btn-heart"
          >
            ♡
          </button>
          <button
            onClick={() => actions.removeFavorite(id)}
            className="btn btn-outline-danger btn-heart"
          >
            X
          </button>

          <Link
            to={`/ruta-comida/${id}`}
            className="btn"
            style={{
              backgroundColor: "rgb(255, 200, 67)",
              color: "black",
            }}
          >
            Saber Más
          </Link>
        </div>
      </div>
    </div>
  );
};
