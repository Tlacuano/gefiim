//Funcion para convertir un base64 a un Blob
const base64ToBlob = (base64:string)=>{
    const binaryString = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const byteArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'application/pdf' });
}

// Función para descargar el Blob
const downloadBlob=(blob:Blob, fileName:string)=> {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}




export const base64ToFile = (base64:string, fileName:string) => {
    const blob = base64ToBlob(base64);

    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    downloadBlob(blob, fileName + ' ' + day + '-' + month + '-' + year + '.pdf');
}