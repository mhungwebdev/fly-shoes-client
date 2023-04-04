function getCookie(name: string) {
    const value = `; ${document.cookie}`.split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];

    return value;
}

export default getCookie;