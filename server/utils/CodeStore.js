let code;

const setCode = (newCode) => {
    code = newCode;
    setTimeout(() =>{
        code = null;
    }, 5 * 60 * 1000);
}

const getCode = () =>{
    return code;
}

module.exports = {
    setCode,
    getCode
}