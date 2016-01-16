/* getExtension
 *
 * Return the file extension from url
 * File extensions include the '.'
 *
 * Handles the following cases elegantly:
 * getExtension("/somefile.css") -> ".css"
 * getExtension("/url/somefile.css") -> ".css"
 * getExtension("/url/somefile.css?version") -> ".css"
 * getExtension("/url/somefile.css?version=3.4.5") -> ".css"
 */
function getExtension(url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split(/\#|\?/)[0]).substr(url.lastIndexOf("."));
}

/**
 * pathJoin
 * Join multiple path components and avoid duplicate separators
 */
function pathJoin(parts){
  console.log(parts)
  var a = parts.map(function(path){
    if (path[0] === "/"){
      path = path.slice(1);
    }
    if (path[path.length - 1] === "/"){
      path = path.slice(0, path.length - 1);
    }
    return path;
  }).join("/");
  console.log(a)
  return a;
}
