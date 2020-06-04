// let qrcode = document.getElementById("image");
const URL = "http://localhost:8080/";
let qrtext;
// let qrprint = document.getElementById("print");

// qrprint.addEventListener("click", printQR);

async function postData(url, data) {
  const resp = await fetch(url,
                             {
                                 method: 'POST',
                                 mode: 'cors',
                                 cache: 'no-cache',
                                 credentials: 'same-origin',
                                 headers: {
                                     'Content-Type': 'application/json'
                                 },
                                 redirect: 'follow',
                                 body: JSON.stringify(data)
                             });
    return resp;
}

async function addRoom(){
  let rname = document.getElementById("rname1").value;
  const resp = await postData(URL + 'addRoom/', {rname: rname});
  const respJson = await resp.json();
  if(respJson.result == "success"){
    alert("Room added successfully");
  }
}


function generateQR() {
  let size = "300x300";
  let data = qrtext;
  let base = "https://api.qrserver.com/v1/create-qr-code"

  let url = `${base}?data=${data}&size=${size}`;
  let qrcode = document.getElementById("image");
  qrcode.src = url;
  document.getElementById("imageDiv").style.display = "block";
}

function printQR() {
  let qrcode = document.getElementById("image");
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

async function genCode(){
  let rname = document.getElementById("rname").value;
  const resp = await postData("http://localhost:8080/getRoomID", {"rname":rname});
  const respJson = await resp.json();
  if(respJson.result == "success"){
    qrtext = respJson.roomID;
    generateQR();
  }

}
