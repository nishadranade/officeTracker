let qrcode = document.getElementById("image");
let qrtext = document.querySelector("textarea");
let qrbtn = document.getElementById("generate");
let qrprint = document.getElementById("print");

qrbtn.addEventListener("click", generateQR);
qrprint.addEventListener("click", printQR);

function generateQR() {
  let size = "300x300";
  let data = qrtext.value;
  let base = "https://api.qrserver.com/v1/create-qr-code"

  let url = `${base}?data=${data}&size=${size}`;

  qrcode.src = url;
}

function printQR() {
  source = qrcode.src;

  var pwa = window.open();
  pwa.document.open();
  pwa.document.write("<html><head><script>function step1(){\n" +
  "setTimeout('step2()', 10);}\n" +
  "function step2(){window.print();window.close()}\n" +
  "</scri" + "pt></head><body onload='step1()'>\n" +
  "<img src='" + source + "' /></body></html>");

  pwa.document.close();
}
