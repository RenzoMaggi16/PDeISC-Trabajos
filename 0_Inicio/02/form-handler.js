/**
 * EL FARO INFORME — form-handler.js
 * Módulo para la validación estricta y envío del formulario ("Unbreakable Code").
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    
    // Evitar el ingreso de números en el campo nombre en tiempo real
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[0-9]/g, '');
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        e.stopPropagation();

        // Validar nativamente y aplicar estilos de Bootstrap
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return; // Detener envío si hay errores
        }

        // Si es válido, simular envío
        form.classList.remove('was-validated');

        // Mostrar Toast de Bootstrap en lugar de Alert "inline"
        const toastEl = document.getElementById('successToast');
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }

        // Limpiar el formulario
        form.reset();
    });
});
