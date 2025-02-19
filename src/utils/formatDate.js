
const formatDate = (date) => {
    let now = new Date(date);
    return now.getHours() + 'h:' + now.getMinutes() + 'p:' + now.getMilliseconds() + 's ' + now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()  ;
}

export default formatDate;