import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
  const [type, setType] = useState(false);

  return {
    store: {
      auth: false,
      url: process.env.BACKEND_URL,
      message: null,
      demo: [],
      restaurantes: [],
      profiles: [],
      likes: [],
      reserva: [],
      restaurante: [],
      went: [],
      profileRestaurante: [],
      url: [],
      precio: [],
    },

    actions: {
      addFavorite: async (id) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/favlocales/" + id,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          await response.json();
          setStore({ auth: true });
        } else if (response.status === 208) {
          alert("Este restaurante ya lo tienes en favoritos");
        }
        return true;
      },

      removeFavorite: async (id) => {
        fetch(process.env.BACKEND_URL + "/api/favlocales/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setStore({ likes: data }));
        return true;
      },

      getFavorit: () => {
        fetch(process.env.BACKEND_URL + "/api/user/favoritos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setStore({ likes: data }));
      },

      addWent: (nombre) => {
        const store = getStore();
        setStore({ went: store.went.concat(nombre) });
      },

      addReserva: async (local_id, date, hora, comensales) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/reserva",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ local_id, date, hora, comensales }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("✅ Reserva realizada con éxito", data);

            // 🔁 Recarga la lista actualizada de reservas
            getActions().getReserva();
          } else {
            console.error("❌ Error al realizar la reserva", response.status);
          }
        } catch (error) {
          console.error("❌ Error en addReserva:", error);
        }
      },

      reservarlocal: async (id) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/reservarlocal/" + id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          await response.json();
          setStore({ auth: true });
        } else if (response.status === 208) {
          alert("Este restaurante ya lo tienes en reservas");
        }
        return true;
      },

      getReserva: () => {
        fetch(process.env.BACKEND_URL + "/api/user/reserva", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) throw new Error("❌ Error al obtener reservas");
            return response.json();
          })
          .then((data) => {
            console.log("🗂️ Reservas actualizadas:", data);
            setStore({ reserva: data });
          })
          .catch((err) => console.error("❌ Error en getReserva:", err));
      },
      login: async (email, password, type) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password, type }),
            headers: { "Content-Type": "application/json" },
          });
          if (response.status === 200) {
            setStore({ auth: true });
            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            if (data.type) {
              localStorage.setItem("esLocal", data.type);
              return true;
            } else {
              localStorage.setItem("esUsuario", false);
              return false;
            }
          }
        } catch (err) {
          console.log(err);
        }
      },

      syncTokenFromLocalStorage: () => {
        const auth = localStorage.getItem("token");
        if (auth && auth !== "" && auth !== undefined) setStore({ auth });
      },

      getInformationCurrentMember: () => {
        fetch(process.env.BACKEND_URL + "/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setStore({ profiles: data }));
      },

      getRestaurantes: async () => {
        fetch(process.env.BACKEND_URL + "/api/restaurantes")
          .then((resp) => resp.json())
          .then((data) => setStore({ restaurantes: data }));
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("esLocal");
        localStorage.removeItem("esUsuario");
        setStore({ auth: false });
      },

      getInformationCurrentRestaurant: () => {
        fetch(process.env.BACKEND_URL + "/api/profile-restaurante", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setStore({ profileRestaurante: data }));
      },

      registroUsuario: async (nombre, apellido, email, password) => {
        const response = await fetch(process.env.BACKEND_URL + "/api/user", {
          method: "POST",
          body: JSON.stringify({ nombre, apellido, email, password }),
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 201) return true;
        alert("Ya hay un usuario registrado con ese email");
        return false;
      },

      añadirPrecio: async (id, precio) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/addPrice/" + id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id, precio }),
          }
        );
        if (response.ok) console.log("Datos guardados");
        else console.log("No se ha podido modificar el dato");
      },

      modificarDatos: async (id, nombre, tipo_local, descripcion) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/editInfoRestaurantes/" + id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id, nombre, tipo_local, descripcion }),
          }
        );
        if (response.ok) console.log("Datos guardados");
        else console.log("No se ha podido modificar el dato");
      },

      uploadFile: async (uploadImages) => {
        const store = getStore();
        const cloud_name = "dqa8txoeg";
        const preset = "ehajybj3";
        const url_claudinari = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
        const formData = new FormData();
        formData.append("file", uploadImages);
        formData.append("upload_preset", preset);
        try {
          const response = await fetch(url_claudinari, {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            setStore({ url: data.url });
          }
        } catch (error) {
          console.log("message", error);
        }
      },

      añadirFoto: async (id) => {
        const store = getStore();
        const response = await fetch(
          process.env.BACKEND_URL + "/api/addPhoto/" + id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id, foto: store.url }),
          }
        );
        if (response.ok) alert("Datos guardados");
        else alert("No se ha podido modificar el dato");
      },
    },
  };
};

export default getState;
