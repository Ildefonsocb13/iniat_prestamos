import Prestamo from "./components/prestamos/prestamo";
import Devolucion from "./components/devoluciones/devolucion";

const Prestamos = () => {
  return (
    <div className="prestamos-container">
      <Prestamo />
      <Devolucion />
    </div>
  );
};

export default Prestamos;
