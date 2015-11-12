// window.addEventListener("devicelight", function (event) {
//   // Read out the lux value
//   var luminosity = event.value;
//   alert(luminosity);
// });

document.getElementById("light").addEventListener("click", function( event ) {
  var elm = document.getElementById("body");
  if (elm.className === "dark") {
    elm.className = "";
    document.cookie="template=";
  } else {
    elm.className = "dark";
    document.cookie="template=dark";
  }
}, false);
