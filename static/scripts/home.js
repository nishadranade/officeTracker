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


async function addEmployee() {
  var fname = document.getElementById('fname').value;
  var lname = document.getElementById('lname').value;
  var email = document.getElementById('email').value;

  var data = { "fname": fname, "lname": lname, "email": email };

  const resp = await postData("http://localhost:8080/addEmployee", data );
  const respJson = await resp.json();
  if( respJson.result == "success"){
    alert("Employee successfully added");
  }
}
