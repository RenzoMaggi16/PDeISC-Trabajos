import React, { useState } from 'react';
import './TarjetaPresentacion.css';

// Componente presentacional para la tarjeta de perfil personal
const TarjetaPresentacion = ({ nombre, apellido, profesion, imagenUrl, descripcion }) => {
  // Estado local para manejar errores al cargar la imagen
  const [imageError, setImageError] = useState(false);

  // Obtiene iniciales del nombre
  const getInitials = () => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '';
    const last  = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${first}${last}` || '??';
  };

  // Se activa si la imagen falla al cargar
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card profile-card p-4 text-center h-100">
      <div className="card-body d-flex flex-column">

        {/* Foto de perfil o avatar de respaldo */}
        <div className="profile-img-container mb-4">
          {!imageError && imagenUrl ? (
            <img
              src={imagenUrl}
              alt={`Fotografía de ${nombre} ${apellido}`}
              className="profile-img"
              onError={handleImageError}
            />
          ) : (
            <div className="avatar-fallback" title="Imagen no disponible">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Nombre completo */}
        <h2 className="profile-name mb-1">
          {nombre} {apellido}
        </h2>

        {/* Badge de profesión */}
        <div className="d-flex justify-content-center mt-2 mb-3">
          <span className="badge profession-badge">
            {profesion || 'Profesional'}
          </span>
        </div>

        {/* Descripción profesional */}
        {descripcion && (
          <p className="profile-description mt-auto">
            {descripcion}
          </p>
        )}
      </div>
    </div>
  );
};

export default TarjetaPresentacion;
