function formattedDate(d:Date) {
    try {
        const date = new Date(d);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();

        return `${day}/${month}/${year}`
    } catch (error) {
        return d
    }
}

export {formattedDate};