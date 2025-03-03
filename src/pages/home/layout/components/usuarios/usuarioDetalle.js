import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";

import {
  getAsistenciasPorMatricula,
  getTiempoAsistido,
  getBitacorasByMatricula, // Importar la función para obtener bitácoras
} from "../../../../../services/api";

const UsuarioDetalle = ({ rowData }) => {
  const [tiempoAsistido, setTiempoAsistido] = useState({
    dias: 0,
    horas: 0,
  });
  const [asistencias, setAsistencias] = useState([]);
  const [bitacoras, setBitacoras] = useState([]); // Estado para las bitácoras
  const [loadingAsistencias, setLoadingAsistencias] = useState(true);
  const [loadingBitacoras, setLoadingBitacoras] = useState(true); // Estado de carga para bitácoras
  const [globalFilterAsistencias, setGlobalFilterAsistencias] = useState("");
  const [globalFilterBitacoras, setGlobalFilterBitacoras] = useState(""); // Filtro global para bitácoras

  useEffect(() => {
    console.log("rowData", rowData);
    if (rowData?.matricula) {
      fetchTiempoAsistido(rowData.matricula);
      fetchAsistencias(rowData.matricula);
      fetchBitacoras(rowData.matricula); // Llamar a la función para obtener bitácoras
    }
  }, [rowData]);

  const fetchTiempoAsistido = async (matricula) => {
    try {
      const response = await getTiempoAsistido(matricula);
      if (response.success && response.data) {
        setTiempoAsistido({
          dias: response.data.dias_asistidos || 0,
          horas: response.data.horas_asistidas || 0,
        });
      } else {
        console.error(
          "No se recibieron datos válidos de tiempo asistido",
          response
        );
      }
    } catch (error) {
      console.error("Error al obtener el tiempo asistido:", error);
    }
  };

  const fetchAsistencias = async (matricula) => {
    setLoadingAsistencias(true);
    try {
      const response = await getAsistenciasPorMatricula(matricula);
      if (response.success && Array.isArray(response.data)) {
        const asistenciasProcesadas = response.data.map((asistencia) => {
          const fechaInicio = new Date(asistencia.fecha_inicio);
          const fechaFin = new Date(asistencia.fecha_fin);

          const diferenciaMs = fechaFin - fechaInicio; // Diferencia en milisegundos
          const horas = Math.floor(diferenciaMs / (1000 * 60 * 60)); // Horas enteras
          const minutos = Math.floor(
            (diferenciaMs % (1000 * 60 * 60)) / (1000 * 60)
          ); // Minutos restantes

          const duracion = `${horas}:${minutos.toString().padStart(2, "0")}`; // Formato hh:mm

          return {
            ...asistencia,
            fecha: fechaInicio.toLocaleDateString(),
            horaEntrada: fechaInicio.toLocaleTimeString(),
            horaSalida: fechaFin.toLocaleTimeString(),
            duracion, // Duración en hh:mm
          };
        });
        setAsistencias(asistenciasProcesadas);
      } else {
        console.error("No se recibieron asistencias válidas", response);
        setAsistencias([]);
      }
    } catch (error) {
      console.error("Error al obtener las asistencias:", error);
      setAsistencias([]);
    } finally {
      setLoadingAsistencias(false);
    }
  };

  const fetchBitacoras = async (matricula) => {
    setLoadingBitacoras(true);
    try {
      const response = await getBitacorasByMatricula(matricula);
      if (response.success && Array.isArray(response.data)) {
        setBitacoras(response.data);
      } else {
        console.error("No se recibieron bitácoras válidas", response);
        setBitacoras([]);
      }
    } catch (error) {
      console.error("Error al obtener las bitácoras:", error);
      setBitacoras([]);
    } finally {
      setLoadingBitacoras(false);
    }
  };

  return (
    <div className="usuario-detalle" style={{ paddingTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {/* Información del usuario */}
        <Card
          title="Información del Usuario"
          style={{ marginBottom: "1rem" }}
          className="p-shadow-3"
        >
          <p>
            <strong>Nombre:</strong> {rowData?.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {rowData?.apellido}
          </p>
          <p>
            <strong>Matrícula:</strong> {rowData?.matricula}
          </p>
          <p>
            <strong>Tipo:</strong> {rowData?.tipo}
          </p>
        </Card>
        {/* Info Addicional */}
        <Card
          title="Info Addicional"
          style={{ marginBottom: "1rem" }}
          className="p-shadow-3"
        >
          <p>
            <strong>Días asistidos:</strong> {tiempoAsistido.dias}
          </p>
          <p>
            <strong>Horas asistidas:</strong> {tiempoAsistido.horas}
          </p>
          <p>
            <strong>Bitácoras realizadas:</strong> {bitacoras.length}
          </p>
        </Card>
      </div>

      {/* Lista de asistencias */}
      <Divider />
      <h3>Historial de Asistencias</h3>
      {/* Buscador global para asistencias */}
      <div style={{ marginBottom: "1rem" }}>
        <InputText
          value={globalFilterAsistencias}
          onChange={(e) => setGlobalFilterAsistencias(e.target.value)}
          placeholder="Buscar en el historial de asistencias"
        />
      </div>
      <DataTable
        value={asistencias}
        globalFilter={globalFilterAsistencias}
        loading={loadingAsistencias}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 15]}
        emptyMessage="No se encontraron asistencias."
        style={{ marginTop: "1rem" }}
      >
        <Column field="fecha" header="Fecha" sortable />
        <Column field="horaEntrada" header="Hora de Entrada" sortable />
        <Column field="horaSalida" header="Hora de Salida" sortable />
        <Column field="duracion" header="Duración (Horas)" sortable />
      </DataTable>

      {/* Lista de bitácoras */}
      <Divider />
      <h3>Historial de Bitácoras</h3>
      {/* Buscador global para bitácoras */}
      <div style={{ marginBottom: "1rem" }}>
        <InputText
          value={globalFilterBitacoras}
          onChange={(e) => setGlobalFilterBitacoras(e.target.value)}
          placeholder="Buscar en el historial de bitácoras"
        />
      </div>
      <DataTable
        value={bitacoras}
        globalFilter={globalFilterBitacoras}
        loading={loadingBitacoras}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 15]}
        emptyMessage="No se encontraron bitácoras."
        style={{ marginTop: "1rem" }}
      >
        <Column field="id" header="ID" sortable />
        <Column field="alumno_matricula" header="Matrícula" sortable />
        <Column field="proyecto_nombre" header="Proyecto" sortable />
        <Column field="actividades" header="Actividades" sortable />
      </DataTable>
    </div>
  );
};

export default UsuarioDetalle;
