
const setCookie = (cname, cvalue, exdays, path) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*3600*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=" + path;
}


export default setCookie;
