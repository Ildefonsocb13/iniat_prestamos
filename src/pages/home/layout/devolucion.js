import React, { useState } from "react";
import axios from "axios"; // Importar axios
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // Importar Toast
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FloatLabel } from "primereact/floatlabel";
import { Dialog } from "primereact/dialog"; // Para el formulario de devolución
import "./devolucion.css"; // Puedes agregar estilos si es necesario

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
      // Simulación de solicitud con Axios (reemplazar la URL con la real)
      /*const response = await axios.post(
        "https://api.example.com/devoluciones",
        { matricula }
      );*/

      // Simulando una respuesta de la API
      const API_RESPONSE = {
        status: "success", // O puede ser "error" si no tiene préstamos
        prestamos: [
          {
            ID: 1,
            objeto: "Computadora",
            fechaSolicitud: "11/12/2013",
            fechaMaxDevolucion: "11/12/2013",
          },
          {
            ID: 2,
            objeto: "Proyector",
            fechaSolicitud: "10/05/2013",
            fechaMaxDevolucion: "10/05/2013",
          },
        ],
      };

      if (API_RESPONSE.status === "success") {
        // Aquí procesamos las fechas para convertirlas a un formato legible
        const prestamosConFechas = API_RESPONSE.prestamos.map((prestamo) => ({
          ...prestamo,
          fechaSolicitud: new Date(
            prestamo.fechaSolicitud
          ).toLocaleDateString(), // Convertir a string con formato MM/DD/YYYY
          fechaMaxDevolucion: new Date(
            prestamo.fechaMaxDevolucion
          ).toLocaleDateString(), // Convertir a string con formato MM/DD/YYYY
        }));

        setPrestamos(prestamosConFechas);
      } else {
        setPrestamos([]);
        toast.current.show({
          severity: "info",
          summary: "No hay préstamos",
          detail: "Esa matrícula no tiene préstamos.",
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
  const handleDevolver = () => {
    // Realizar la solicitud de devolución aquí
    try {
      // Aquí harías la llamada real para devolver el préstamo
      // const response = await axios.post("https://api.example.com/devolver", { ID: selectedPrestamo.ID, fechaDevolucion });

      toast.current.show({
        severity: "success",
        summary: "Devolución exitosa",
        detail: `El préstamo de ${selectedPrestamo.objeto} ha sido devuelto.`,
        life: 3000,
      });

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

  return (
    <div
      className="devoluciones-container"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
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
              onChange={(e) => setMatricula(e.target.value)}
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
              rows={5}
              removableSort
            >
              <Column field="objeto" sortable header="Objeto" />
              <Column
                field="fechaSolicitud"
                sortable
                header="Fecha de Solicitud"
              />
              <Column
                field="fechaMaxDevolucion"
                sortable
                header="Devolución antes del:"
              />
              <Column
                body={(rowData) => (
                  <Button
                    label="Devolver"
                    icon="pi pi-refresh"
                    className="p-button-danger"
                    onClick={() => {
                      setSelectedPrestamo(rowData);
                      setShowForm(true);
                    }}
                  />
                )}
                header="Acciones"
              />
            </DataTable>
          </div>
        </Card>
      )}

      {/* Formulario de devolución en un Dialog */}
      <Dialog
        visible={showForm}
        style={{ width: "400px" }}
        header="Devolver Préstamo"
        onHide={() => setShowForm(false)}
      >
        <div>
          <p>
            <strong>Objeto:</strong> {selectedPrestamo?.objeto}
          </p>
          <Button
            label="Devolver"
            icon="pi pi-check"
            onClick={handleDevolver}
            style={{ marginTop: "1rem" }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Devolucion;
