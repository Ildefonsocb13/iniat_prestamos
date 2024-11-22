import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

import { getPrestamos } from "../../../../services/api";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import "./historialPrestamos.css";

const HistorialPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]); // Estado para almacenar los préstamos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [globalFilter, setGlobalFilter] = useState(""); // Filtro global para la búsqueda

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  // Función para obtener los datos de los préstamos
  const fetchPrestamos = async () => {
    try {
      const response = await getPrestamos();
      setPrestamos(response.data); // Asignar los datos al estado
    } catch (error) {
      console.error("Error al obtener los préstamos:", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Función para aplicar estilos condicionales a las filas
  const rowClassName = (rowData) => {
    switch (rowData.status) {
      case "sin solicitar":
        return "row-sin-solicitar"; // Clase CSS para este estado
      case "pendiente":
        return "row-pendiente"; // Clase CSS para este estado
      case "aprobada":
        return "row-aprobada"; // Clase CSS para este estado
      default:
        return "";
    }
  };

  // Ejecutar la función al cargar el componente
  useEffect(() => {
    fetchPrestamos();
  }, []);

  return (
    <div className="historial-prestamos-container">
      <Card>
        {/* Campo de búsqueda global */}
        <div className="p-fluid">
          <InputText
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Buscar en tabla"
            className="p-mt-2"
          />
        </div>
        <DataTable
          value={prestamos}
          loading={loading}
          paginator
          rows={10}
          removableSort
          emptyMessage="No hay préstamos registrados."
          globalFilter={globalFilter}
          rowClassName={rowClassName} // Aplica estilos condicionales
        >
          {/* Columnas */}
          <Column field="status" header="Estado" sortable />
          <Column field="objeto" header="Objeto" sortable />
          <Column field="matricula" header="Matricula" sortable />
          <Column field="fecha_prestamo" header="Fecha de Préstamo" sortable />
          <Column
            field="fecha_max_devolucion"
            header="Fecha Máx. Devolución"
            sortable
          />
          <Column
            field="fecha_devolucion"
            header="Fecha de Devolucion"
            sortable
          />
          <Column field="descripcion_entrega" header="Ubicacion" sortable />
          <Column field="status" header="Estado" sortable />
          <Column field="aprobado" header="Aprobado por" sortable />
        </DataTable>
      </Card>
    </div>
  );
};

export default HistorialPrestamos;
