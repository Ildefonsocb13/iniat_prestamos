import axios from "axios";

// Configuración base de Axios
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api/handler";

/**
 * Realiza una solicitud para obtener préstamos.
 * @returns {Promise} Respuesta de la API.
 */
export const getPrestamos = async () => {
  try {
    const response = await axios.post(`${API_URL}/prestamos/getPrestamos.php`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Realiza una solicitud para obtener las peticiones de devolucion.
 * @returns {Promise} Respuesta de la API.
 */
export const getDevolucionesPorAprobar = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/prestamos/getDevolucionesPorAprobar.php`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Realiza una solicitud para obtener préstamos por matrícula.
 * @param {string} matricula - La matrícula a buscar.
 * @returns {Promise} Respuesta de la API.
 */
export const getPrestamosPorMatricula = async (matricula) => {
  try {
    const response = await axios.post(
      `${API_URL}/prestamos/getPrestamosPorMatricula.php`,
      {
        data: { matricula },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Realiza una solicitud para crear un prestamo.
 * @param {string} matricula - Matricula del usuario.
 * @param {string} objeto - Objeto prestado.
 * @param {string} fecha_max_devolucion - Fecha de devolucion max.
 * @returns {Promise} Respuesta de la API.
 */
export const crearPrestamo = async (
  matricula,
  objeto,
  fecha_max_devolucion
) => {
  try {
    const response = await axios.post(
      `${API_URL}/prestamos/crearPrestamo.php`,
      {
        data: { matricula, objeto, fecha_max_devolucion },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Realiza una solicitud para crear una devolución.
 * @param {number} id - ID del préstamo.
 * @param {string} descripcion_entrega - Descripción de la devolución.
 * @returns {Promise} Respuesta de la API.
 */
export const crearDevolucion = async (id, descripcion_entrega) => {
  try {
    const response = await axios.post(
      `${API_URL}/prestamos/crearDevolucion.php`,
      {
        data: { id, descripcion_entrega },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Realiza una solicitud para crear una devolución.
 * @param {number} id - ID del préstamo.
 * @param {string} matricula - Matricula del usuario.
 * @param {string} objeto - Objeto prestado.
 * @param {string} fecha_max_devolucion - Fecha de devolucion max.
 * @param {string} descripcion_entrega - Descripción de la devolución.
 * @param {string} status - Estado de devolucion.
 * @param {string} aprobado - Correo de la persona que aprobo la devolucion.
 *
 * @returns {Promise} Respuesta de la API.
 */
export const updatePrestamo = async (
  id,
  matricula,
  objeto,
  fecha_max_devolucion,
  descripcion_entrega,
  status,
  aprobado
) => {
  try {
    const response = await axios.post(
      `${API_URL}/prestamos/updatePrestamo.php`,
      {
        data: {
          id,
          matricula,
          objeto,
          fecha_max_devolucion,
          descripcion_entrega,
          status,
          aprobado,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Realiza la confirmacion de la devolucion de un prestamo.
 * @param {number} id - ID del prestamo.
 * @param {string} aprobado - Dato del usuario que aprobo la devolucion.
 * @returns {Promise} Respuesta de la API.
 */
export const aprobarDevolucion = async (id, aprobado) => {
  try {
    const response = await axios.post(
      `${API_URL}/prestamos/aprobarDevolucion.php`,
      {
        data: { id, aprobado },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Manejo genérico de errores.
 * @param {Error} error - Error lanzado por axios.
 */
const handleError = (error) => {
  if (error.response) {
    // Respuesta de error del servidor
    console.error("Error en la respuesta:", error.response.data);
    throw new Error(error.response.data.errorMessage || "Error en el servidor");
  } else if (error.request) {
    // Sin respuesta del servidor
    console.error("No se recibió respuesta del servidor:", error.request);
    throw new Error("No se pudo conectar con el servidor");
  } else {
    // Error en la configuración
    console.error("Error en la solicitud:", error.message);
    throw new Error("Error en la configuración de la solicitud");
  }
};

//  Modulo de Asistencia ------------------------------------------------------------------------

/**
 * Registra la asistencia de un usuario.
 * @param {string} matricula - La matrícula del usuario.
 * @param {string} tipo - Tipo de registro ("entrada" o "salida").
 * @returns {Promise} Respuesta de la API.
 */
export const registrarAsistencia = async (matricula, tipo) => {
  try {
    const response = await axios.post(
      `${API_URL}/asistencias/registrarAsistencia.php`,
      {
        matricula,
        tipo,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtiene las asistencias de un usuario por matrícula.
 * @param {string} matricula - Matrícula del usuario.
 * @returns {Promise} Respuesta de la API.
 */
export const getAsistenciasPorMatricula = async (matricula) => {
  console.log("matricula", matricula);
  try {
    const response = await axios.post(
      `${API_URL}/asistencias/getAsistenciasPorMatricula.php`,
      {
        data: { matricula },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtiene los días y horas asistidas de un usuario por matrícula.
 * @param {string} matricula - Matrícula del usuario.
 * @returns {Promise} Respuesta de la API con días y horas asistidas.
 */
export const getTiempoAsistido = async (matricula) => {
  try {
    const response = await axios.post(
      `${API_URL}/asistencias/getTiempoAsistido.php`,
      {
        data: { matricula },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtiene las asistencias en un rango de fechas.
 * @param {string} fecha_inicio - Fecha de inicio en formato "YYYY-MM-DD".
 * @param {string} fecha_fin - Fecha de fin en formato "YYYY-MM-DD".
 * @returns {Promise} Respuesta de la API.
 */
export const getAsistenciasPorRangoFechas = async (fecha_inicio, fecha_fin) => {
  try {
    const response = await axios.post(
      `${API_URL}/asistencias/getAsistenciasPorRangoFechas.php`,
      {
        fecha_inicio,
        fecha_fin,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Calcula las horas trabajadas por matrícula en un rango de fechas.
 * @param {string} matricula - Matrícula del usuario.
 * @param {string} fecha_inicio - Fecha de inicio en formato "YYYY-MM-DD".
 * @param {string} fecha_fin - Fecha de fin en formato "YYYY-MM-DD".
 * @returns {Promise} Respuesta de la API con las horas trabajadas.
 */
export const calcularHorasTrabajadas = async (
  matricula,
  fecha_inicio,
  fecha_fin
) => {
  try {
    const response = await axios.post(
      `${API_URL}/asistencias/calcularHorasTrabajadas.php`,
      {
        matricula,
        fecha_inicio,
        fecha_fin,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

//  Modulo de Usuarios ------------------------------------------------------------------------

/**
 * Agrega o edita un usuario.
 * @param {Object} usuario - Objeto con los datos del usuario (id, nombre, apellido, matricula, tipo).
 * @returns {Promise} Respuesta de la API.
 */
export const saveUsuario = async (usuario) => {
  try {
    console.log("usuario", usuario);
    const response = await axios.post(
      `${API_URL}/usuarios/addEditUsuario.php`,
      {
        data: usuario,
      }
    ); // Asegúrate de que la URL y los datos sean correctos
    if (response.data.success) {
      return response.data; // Devuelve la respuesta si fue exitosa
    } else {
      throw new Error(response.data.message || "Error desconocido");
    }
  } catch (error) {
    console.error("Error en saveUsuario:", error);
    throw error; // Propaga el error para que el catch en el frontend lo maneje
  }
};

/**
 * Obtiene todos los usuarios.
 * @returns {Promise} Respuesta de la API con la lista de usuarios.
 */
export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/getUsuarios.php`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Elimina un usuario por su ID.
 * @param {number} id - ID del usuario a eliminar.
 * @returns {Promise} Respuesta de la API.
 */
export const deleteUsuario = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/deleteUsuario.php`, {
      data: {
        id,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
