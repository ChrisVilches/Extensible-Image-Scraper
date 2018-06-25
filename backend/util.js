let hashCode = function(string) {
  var hash = 0;
  if (string.length == 0) {
    return hash;
  }
  for (var i = 0; i < string.length; i++) {
    var char = string.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}


let getNow = function(){
  let d = new Date();
  return `${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
}



module.exports = {
  hashCode,
  getNow
};
