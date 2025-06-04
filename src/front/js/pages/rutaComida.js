import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/perfilRestaurante.css";
import Swal from "sweetalert2";

export const RutaComida = () => {
  const { store, actions } = useContext(Context);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [comensales, setComensales] = useState(1);
  const { theid } = useParams();

  const restaurante = store.restaurantes.find(
    (rest) => rest.id === parseInt(theid)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔎 Validación básica antes de enviar
    if (!date || !hour || !comensales || comensales < 1) {
      return Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, rellena todos los campos correctamente antes de reservar.",
        confirmButtonColor: "#ffc843",
      });
    }

    try {
      await actions.addReserva(store.profiles?.id, date, hour, comensales);
      await actions.reservarlocal(restaurante?.id);

      Swal.fire({
        icon: "success",
        title: "¡Reserva realizada!",
        html: `
          <p>Has reservado en <strong>${restaurante?.nombre}</strong></p>
          <p>📅 <strong>${date}</strong> a las ⏰ <strong>${hour}</strong></p>
          <p>👥 <strong>${comensales}</strong> comensales</p>
        `,
        confirmButtonColor: "#ffc843",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al realizar la reserva.",
        confirmButtonColor: "#ffc843",
      });
    }
  };

  useEffect(() => {
    actions.getInformationCurrentMember();
    actions.getRestaurantes();
  }, []);

  return (
    <>
      <div className="background">
        <div className="container d-flex flex-wrap justify-content-center align-items-center gap-5 py-5">
          <div
            className="rounded shadow overflow-hidden"
            style={{ width: "600px", maxWidth: "90%" }}
          >
            <img
              src={restaurante?.foto}
              alt={`Imagen de ${restaurante?.nombre}`}
              className="img-fluid w-100"
              style={{
                objectFit: "cover",
                height: "100%",
                borderRadius: "12px",
              }}
            />
          </div>

          <div
            className="position-relative px-4 py-4 shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid rgb(255, 200, 67)",
              borderRadius: "15px",
              maxWidth: "600px",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "-15px",
                backgroundColor: "#ffc843",
                padding: "6px 16px",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                transform: "rotate(-10deg)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              Precio medio: {restaurante?.precio}€
            </div>

            <h3 className="mb-2 text-center">
              <em>{restaurante?.nombre}</em>
            </h3>
            <hr className="w-50 mx-auto" />
            <p
              className="mt-3 text-justify"
              style={{ lineHeight: "1.6", fontSize: "1.05rem" }}
            >
              {restaurante?.descripcion}
            </p>
          </div>
        </div>
      </div>

    
      <div className="text-center mt-5">
        <Link to="/restaurantes">
          <button
            className="btn"
            style={{ backgroundColor: "rgb(255, 200, 67)", color: "black" }}
          >
            Volver atrás
          </button>
        </Link>
      </div>
    </>
  );
};
