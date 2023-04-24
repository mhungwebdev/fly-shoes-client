const sortByField = (field: string,data:Array<any>) => {
    return data.sort((a, b) => a[field] < b[field] ? 1 : -1);
}

export {
    sortByField
}