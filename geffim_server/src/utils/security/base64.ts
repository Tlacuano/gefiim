export const convertToBase64 = async (pdfDoc: any) => {
    const Base64 = await new Promise<string>((resolve, reject) => {
        pdfDoc.getBase64((result: string | null) => {
            if (result) {
                resolve(result);
            } else {
                reject(new Error('Error generating the document'));
            }
        });
    });
    return `${Base64}`;
}