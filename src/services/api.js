import axios from "axios";

// Configuración base de Axios
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/**
 * Realiza una solicitud para obtener préstamos.
 * @returns {Promise} Respuesta de la API.
 */
export const getPrestamos = async () => {
  try {
    const response = await axios.post(`${API_URL}/getPrestamos.php`);
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
      `${API_URL}/getPrestamosPorMatricula.php`,
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
    const response = await axios.post(`${API_URL}/crearPrestamo.php`, {
      data: { matricula, objeto, fecha_max_devolucion },
    });
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
    const response = await axios.post(`${API_URL}/crearDevolucion.php`, {
      data: { id, descripcion_entrega },
    });
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
    const response = await axios.post(`${API_URL}/updatePrestamo.php`, {
      data: {
        id,
        matricula,
        objeto,
        fecha_max_devolucion,
        descripcion_entrega,
        status,
        aprobado,
      },
    });
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
