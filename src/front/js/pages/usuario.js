import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { CarruselCard } from "../component/carruserCard";
import Swal from "sweetalert2";
import "../../styles/user.css";
import "../../styles/loginError.css";

export const Usuario = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getFavorit();
    actions.getInformationCurrentMember();
    actions.getReserva();
  }, []);

  const verResera = () => {
    const reserva = store.reserva[store.reserva.length - 1];
    const nombreRestaurante =
      reserva?.local_nombre || "restaurante desconocido";
    const foto = reserva?.foto || "";
    const date = reserva?.fecha || "";
    const hora = reserva?.hora || "no indicada";
    const comensales = reserva?.comensales || "no especificado";

    Swal.fire({
      title: `Tienes una reserva en ${nombreRestaurante}`,
      html: `
      <p><strong>📅 Fecha:</strong> ${new Date(date).toLocaleDateString()}</p>
      <p><strong>⏰ Hora:</strong> ${hora}</p>
      <p><strong>👥 Comensales:</strong> ${comensales}</p>
    `,
      imageUrl: foto,
      imageWidth: 450,
      imageHeight: 250,
      imageAlt: "Imagen del restaurante",
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#ffc843",
      background: "#fff8e1",
      padding: "2em",
      color: "#333",
    });
  };

  return (
    <>
      {store.auth &&
      store.auth !== "" &&
      store.auth !== undefined &&
      localStorage.getItem("esUsuario") ? (
        <div className="container-fluid home-background py-5">
          <div className="container">
            <h1 className="mb-3">
              Ey, {store.profiles?.nombre} {store.profiles?.apellido}
            </h1>
            <p className="fs-5">
              <strong>¡Bienvenido oficialmente a la comunidad RUTA 3B!</strong>
            </p>
            <p>
              Desde ahora formas parte de un movimiento que apuesta por
              descubrir los rincones más auténticos de nuestra ciudad: esos
              bares, tabernas y locales que destacan por ser{" "}
              <strong>Buenos, Bonitos y Baratos</strong>.
            </p>
            <p>
              Como nuevo miembro, tendrás acceso a una selección única de sitios
              cuidadosamente elegidos por la comunidad. Lugares donde la
              calidad, el trato cercano y el precio justo no son una excepción,
              sino una norma.
            </p>
            <p>
              <strong>¿Nuestra filosofía?</strong> Conectar personas con
              experiencias reales. Disfrutar de una buena tapa, un ambiente
              acogedor y una atención de diez sin vaciarte el bolsillo.
            </p>
            <p>
              Además, tu opinión cuenta. Deja tu valoración tras cada visita:
              ayudarás a otros usuarios y entrarás automáticamente en nuestro{" "}
              <strong>sorteo mensual de experiencias gastronómicas</strong>.
            </p>

            <hr className="my-5" />

            <h2 className="text-center mb-4">Mis sitios favoritos</h2>
            <CarruselCard />
          </div>
        </div>
      ) : (
        <div className="div-err-login text-center">
          <h2>Primero debería registrarse!</h2>
          <button type="button" className="btn btn-warning text-dark">
            <Link className="button-err text-dark" to="/">
              Volver al Inicio
            </Link>
          </button>
        </div>
      )}
    </>
  );
};
