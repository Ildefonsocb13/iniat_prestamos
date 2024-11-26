import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // Importar Toast
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FloatLabel } from "primereact/floatlabel";
import { Dialog } from "primereact/dialog"; // Para el formulario de devolución
import "./devolucion.css"; // Puedes agregar estilos si es necesario

import {
  getPrestamosPorMatricula,
  crearDevolucion,
} from "../../../services/api";

const Devolucion = () => {
  const [matricula, setMatricula] = useState(""); // Estado de la matrícula
  const [prestamos, setPrestamos] = useState([]); // Lista de préstamos
  const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario de devolución
  const [selectedPrestamo, setSelectedPrestamo] = useState(null); // Prestamo seleccionado para devolver
  const toast = React.useRef(null); // Referencia para mostrar el Toast
  const [globalFilter, setGlobalFilter] = useState(""); // Filtro global para la búsqueda

  // Realizar la petición cuando se haga la búsqueda por matrícula
  const handleSearch = async () => {
    if (!matricula) {
      toast.current.show({
        severity: "error",
        summary: "Matrícula vacía",
        detail: "Por favor, ingresa una matrícula.",
        life: 3000,
      });
      return;
    }

    try {
      const API_RESPONSE = await getPrestamosPorMatricula(matricula);

      if (API_RESPONSE.success === true) {
        if (API_RESPONSE.data && API_RESPONSE.data.length > 0) {
          // Procesar los datos si existen
          const prestamosConFechas = API_RESPONSE.data.map((prestamo) => ({
            ...prestamo,
            fecha_prestamo: new Date(
              prestamo.fecha_prestamo
            ).toLocaleDateString(), // Convertir a string con formato MM/DD/YYYY
            fecha_max_devolucion: new Date(
              prestamo.fecha_max_devolucion
            ).toLocaleDateString(), // Convertir a string con formato MM/DD/YYYY
          }));

          setPrestamos(prestamosConFechas);
        } else {
          // Manejar el caso donde no hay datos
          setPrestamos([]);
          toast.current.show({
            severity: "info",
            summary: "Sin resultados",
            detail: "No se encontraron préstamos para esta matrícula.",
            life: 3000,
          });
        }
      } else {
        // Manejar errores en la solicitud
        console.log("API_RESPONSE", API_RESPONSE);
        setPrestamos([]);
        toast.current.show({
          severity: "error",
          summary: "Error al obtener datos",
          detail: "Hubo un problema al realizar la solicitud.",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error en la conexión",
        detail: "No se pudo obtener los préstamos. Intente nuevamente.",
        life: 3000,
      });
    }
  };

  // Función para manejar la devolución del préstamo
  const handleDevolver = async () => {
    if (
      !selectedPrestamo?.descripcion_entrega ||
      selectedPrestamo.descripcion_entrega.trim() === ""
    ) {
      // Mostrar un mensaje de error si el campo está vacío
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor, proporciona la descripción de entrega.",
        life: 3000,
      });
      return; // No ejecutar el resto de la lógica
    }

    // Realizar la solicitud de devolución aquí
    try {
      const API_RESPONSE = await crearDevolucion(
        selectedPrestamo.id,
        selectedPrestamo.descripcion_entrega
      );

      if (API_RESPONSE.success === true) {
        toast.current.show({
          severity: "success",
          summary: "Solicitud exitosa",
          detail: API_RESPONSE.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error en la solicitud",
          detail: API_RESPONSE.message,
          life: 3000,
        });
      }

      // Cerrar el formulario de devolución
      setShowForm(false);
      setPrestamos(prestamos.filter((p) => p.ID !== selectedPrestamo.ID));
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error en la devolución",
        detail: "No se pudo procesar la devolución. Intente nuevamente.",
        life: 3000,
      });
    }
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  // Función para mostrar el botón adecuado según el estado
  const statusBodyTemplate = (rowData) => {
    const { status } = rowData;

    if (status === "sin solicitar") {
      return (
        <Button
          label="Devolver"
          icon="pi pi-refresh"
          onClick={() => {
            setSelectedPrestamo(rowData);
            setShowForm(true);
          }}
        />
      );
    } else if (status === "pendiente") {
      return (
        <Button
          label="Pendiente"
          icon="pi pi-clock"
          disabled
          style={{ backgroundColor: "orange" }}
        />
      );
    } else if (status === "aprobada") {
      return (
        <Button
          label="Aprobada"
          icon="pi pi-check"
          disabled
          style={{ backgroundColor: "green" }}
        />
      );
    }

    return null; // Para manejar cualquier otro caso, si es necesario
  };

  // Función para manejar el cambio en el campo de la descripción
  const handleDescripcionEntregaChange = (e) => {
    const value = e.target.value;
    setSelectedPrestamo((prevState) => ({
      ...prevState,
      descripcion_entrega: value,
    }));
  };

  return (
    <div
      className="devoluciones-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Toast para mostrar mensajes */}
      <Toast ref={toast} />

      <Card title="Buscar Préstamos por Matrícula">
        {/* Input para la matrícula */}
        <div className="p-fluid">
          <FloatLabel>
            <InputText
              value={matricula}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setMatricula(value);
                }
              }}
              placeholder="eg. 215951"
              autoFocus
            />
            <label>Matrícula</label>
          </FloatLabel>

          {/* Botón para buscar */}
          <Button
            label="Buscar prestamos"
            icon="pi pi-search"
            style={{ marginTop: "1rem" }}
            onClick={handleSearch}
          />
        </div>
      </Card>

      {/* DataTable que muestra los préstamos */}
      {prestamos.length > 0 && (
        <Card title="Prestamos Activos">
          <div>
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
              globalFilter={globalFilter}
              paginator
              rows={10}
              removableSort
            >
              <Column body={statusBodyTemplate} header="Acción" />
              <Column field="objeto" sortable header="Objeto" />
              <Column
                field="fecha_prestamo"
                sortable
                header="Fecha de Solicitud"
              />
              <Column
                field="fecha_devolucion"
                sortable
                header="Fecha de Devolucion"
              />
              <Column
                field="fecha_max_devolucion"
                sortable
                header="Devolución antes del:"
              />
              <Column field="descripcion_entrega" sortable header="Ubicacion" />
              <Column field="aprobado" sortable header="Aprobado por" />
            </DataTable>
          </div>
        </Card>
      )}

      {/* Formulario de devolución en un Dialog */}
      <Dialog
        visible={showForm}
        style={{
          width: "400px",
        }}
        header="Devolver Préstamo"
        onHide={() => setShowForm(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p>
            <strong>Objeto:</strong> {selectedPrestamo?.objeto}
          </p>
          <FloatLabel>
            <InputText
              value={selectedPrestamo?.descripcion_entrega}
              onChange={handleDescripcionEntregaChange}
              placeholder="eg. Se guardo en...Entrego a..."
              autoFocus
            />
            <label>Donde lo dejas</label>
          </FloatLabel>
          <p>
            Recuerda que el material es de todos, cuídalo y regresalo
            oportunamente
          </p>
          <Button
            label="Devolver"
            icon="pi pi-check"
            onClick={handleDevolver}
            className="dialog-devolver"
            style={{ backgroundColor: "#ee3e43" }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Devolucion;
