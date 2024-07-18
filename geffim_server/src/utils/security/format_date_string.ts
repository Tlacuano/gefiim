
export const formatDate = (date: string): string => {
    const datePart  = date.split('T')[0];

    const dateArray = datePart.split('-');
    const [year, month, day] = dateArray;

    return `${day}/${month}/${year}`;
}
