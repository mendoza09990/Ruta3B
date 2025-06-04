import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import RegistroUsuario from "../component/registroUsuario";
import "../../styles/registro.css";
import { Context } from "../store/appContext";

export const RegistroUsuarioView = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="background">
      <div className="container">
        <RegistroUsuario />
      </div>
    </div>
  );
};
