import React, { useState } from 'react';
import './Contador.css';

// Componente Contador interactivo con control de límites
const Contador = () => {
  // Estado para el número actual
  const [count, setCount] = useState(0);

  // Estado para la advertencia en español
  const [warning, setWarning] = useState('');

  // Incrementa el valor en 1
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    setWarning('');
  };

  // Decrementa el valor en 1 (evita negativos)
  const handleDecrement = () => {
    if (count === 0) {
      setWarning('El contador no puede ser menor a 0.');
      return;
    }
    setCount((prev) => prev - 1);
    setWarning('');
  };

  // Restablece el contador a 0
  const handleReset = () => {
    setCount(0);
    setWarning('');
  };

  return (
    <div className="contador-wrapper">
      {/* ── Tarjeta principal: Valor del Contador ── */}
      <div className="card contador-card p-5 text-center">
        <div className="card-body">
          <h5 className="contador-title text-uppercase mb-4">
            Valor del Contador
          </h5>

          {/* Valor prominente */}
          <div className={`contador-display mb-4 ${count === 0 ? 'at-zero' : ''}`}>
            {count}
          </div>

          {/* Indicadores de estado */}
          {count === 0 && !warning && (
            <div className="alert alert-warning-custom py-2 px-3 mb-4 mx-auto" style={{ maxWidth: '320px' }}>
              <small>⚠️ Límite inferior alcanzado (0)</small>
            </div>
          )}
          {warning && (
            <div className="alert alert-danger py-2 px-3 mb-4 mx-auto" style={{ maxWidth: '360px' }}>
              <small>{warning}</small>
            </div>
          )}

          {/* Botones de interacción */}
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              className="btn btn-success btn-contador btn-lg px-4"
              onClick={handleIncrement}
              title="Incrementar 1"
            >
              + Incrementar
            </button>
            <button
              className="btn btn-outline-danger btn-contador btn-lg px-4"
              onClick={handleDecrement}
              disabled={count === 0}
              title={count === 0 ? 'No es posible decrementar por debajo de 0' : 'Decrementar 1'}
            >
              − Decrementar
            </button>
            <button
              className="btn btn-outline-secondary btn-contador btn-lg px-4"
              onClick={handleReset}
              disabled={count === 0}
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contador;
