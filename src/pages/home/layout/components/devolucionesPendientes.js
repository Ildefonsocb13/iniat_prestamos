import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";

import {
  getDevolucionesPorAprobar,
  aprobarDevolucion,
} from "../../../../services/api";

import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { useUser } from "@clerk/clerk-react";

import "./devolucionesPendientes.css";

const DevolucionesPendientes = () => {
  const [prestamos, setPrestamos] = useState([]); // Estado para almacenar los préstamos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [globalFilter, setGlobalFilter] = useState(""); // Filtro global para la búsqueda
  const toast = useRef(null); // Referencia para el Toast
  const { user } = useUser(); // Correo del usuario

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  // Función para obtener los datos de los préstamos
  const fetchPrestamos = async () => {
    try {
      const response = await getDevolucionesPorAprobar();
      setPrestamos(response.data); // Asignar los datos al estado
    } catch (error) {
      console.error("Error al obtener los préstamos:", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Ejecutar la función al cargar el componente
  useEffect(() => {
    fetchPrestamos();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  // Renderizar botón de acción
  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        label="Aprobar"
        icon="pi pi-check"
        onClick={() => showConfirmDialog(rowData)}
        className="p-button-success"
      />
    );
  };

  // Función para mostrar el diálogo de confirmación
  const showConfirmDialog = (prestamo) => {
    confirmDialog({
      header: "Confirmar Aprobación",
      message: (
        <div className="flex flex-column align-items-center w-full gap-3">
          <span>¿Estás seguro de aprobar esta devolucion?</span>
        </div>
      ),
      accept: () => handleApprove(prestamo),
      reject: () =>
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "Aprobación cancelada",
          life: 3000,
        }),
    });
  };

  // Función para manejar la aprobación
  const handleApprove = async (prestamo) => {
    try {
      const API_RESPONSE = await aprobarDevolucion(prestamo.id, userEmail);

      if (API_RESPONSE.success === true) {
        toast.current.show({
          severity: "success",
          summary: "Solicitud exitosa",
          detail: API_RESPONSE.message,
          life: 3000,
        });
        setPrestamos(prestamos.filter((p) => p.ID !== prestamo.ID));
        console.log("solicitud exitosa");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error en la solicitud",
          detail: API_RESPONSE.message,
          life: 3000,
        });
        console.log("solicitud Erronea");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error en la solicitud",
        detail: "No se pudo aprobar la devolucion. Intente nuevamente.",
        life: 3000,
      });
      console.log("Error en la solicitud");
    }
  };

  return (
    <div className="devoluciones-pendientes-container">
      <Toast ref={toast} />
      <ConfirmDialog />
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
        >
          {/* Columnas */}
          <Column body={actionBodyTemplate} header="Acción" />
          <Column field="objeto" header="Objeto" sortable />
          <Column field="matricula" header="Matricula" sortable />
          <Column field="descripcion_entrega" header="Ubicacion" sortable />
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
        </DataTable>
      </Card>
    </div>
  );
};

export default DevolucionesPendientes;
