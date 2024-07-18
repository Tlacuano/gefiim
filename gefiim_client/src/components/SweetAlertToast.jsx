import Swal from "sweetalert2";

export const SweetAlert = (icon = 'question', title, text, confirmuttonText, onConfirm ) => {

    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: confirmuttonText,

    }).then(async (result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};

export const ToastWarning = (title, text) => {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: "top-end",
    });
}

export const LoadAlert = (show) => {
    if (show) {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didRender: () => {
                Swal.showLoading()
            },
            didOpen: () => {
                Swal.showLoading()
            }
        })
    } else {
        Swal.close()
    }
}


