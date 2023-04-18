const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const validatePhone = (phone: string) => {
    var phoneno = /^\d{10}$/;
    if (phone.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}

export {
    validateEmail,
    validatePhone
}