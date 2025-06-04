import React from "react";
import "../../styles/perfilRestaurante.css";

export const Nosotros = () => {
  return (
    <div className="home-background">
      <div
        className="container-fluid"
        style={{
          backgroundColor: "rgb(255, 200, 67)",
          padding: "6rem",
          borderRadius: "0 0 15px 15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "1.1rem",
          lineHeight: "1.8",
        }}
      >
        <h2 className="mb-4">
          <strong>Sobre nosotros</strong>
        </h2>
        <p>
          ¡Qué alegría tenerte por aquí! Si has llegado hasta esta sección, es
          porque formas parte de la comunidad o estás pensando en unirte a la{" "}
          <strong>RUTA 3B</strong>, una plataforma pensada para dar visibilidad
          a los locales que realmente merecen ser descubiertos.
        </p>
        <p>
          En <strong>RUTA 3B</strong> creemos que lo auténtico no tiene que ser
          caro ni exclusivo. Nuestro objetivo es conectar a personas con bares,
          taperías, restaurantes y negocios de barrio que ofrecen una
          experiencia única, cercana y honesta. No importa si tu local es
          pequeño, si estás lejos del centro o si acabas de comenzar: aquí
          tendrás la oportunidad de brillar.
        </p>
        <p>
          Desde nuestra plataforma podrás mostrar tus servicios y promociones de
          forma rápida y sencilla. ¿Y si eres usuario? Estás en el lugar ideal
          para descubrir nuevos rincones, saborear lo local y apoyar a quienes
          lo dan todo cada día por ofrecer un servicio de calidad. Porque nos
          encanta ir de tapas, disfrutar de un buen ambiente y pagar un precio
          justo. Esa es la esencia de la <strong>Ruta 3B</strong>.
        </p>

        <h2 className="mt-5 mb-4">
          <strong>Nuestra política</strong>
        </h2>
        <p>
          Nuestra filosofía se basa en tres pilares fundamentales que definen
          todo lo que representa <strong>RUTA 3B</strong>:
        </p>
        <ul style={{ fontWeight: "500" }}>
          <li>
            ✅ <strong>Buena calidad:</strong> Productos, atención y ambiente
            cuidados con mimo.
          </li>
          <li>
            🤝 <strong>Buen trato al cliente:</strong> Cercanía, respeto y
            humanidad en cada interacción.
          </li>
          <li>
            💰 <strong>Buen precio:</strong> Ofrecer siempre una relación justa
            entre lo que se paga y lo que se recibe.
          </li>
        </ul>
        <p className="mt-4">
          Si crees en estos valores, este es tu lugar. Y si eres usuario,
          disfruta con la tranquilidad de saber que todos los locales de nuestra
          red cumplen con estos principios. Queremos que cada experiencia 3B sea
          sinónimo de descubrimiento, autenticidad y disfrute.
        </p>
      </div>
    </div>
  );
};
