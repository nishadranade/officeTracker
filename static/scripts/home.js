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
    alert("Employee successfully added:" +
    "\nUserID: " + respJson.userID + "\nFirstName: " + respJson.firstName + "\nLastName: "+ respJson.lastName +
    "\nEmail: " + respJson.email);
  }
  else{
    alert("An error has occurred. Please check if the employee already exists.");
  }
}

async function getEmployee() {
  var email = document.getElementById('email2').value;

  const resp = await postData("http://localhost:8080/getEmployee", {"email": email });
  const respJson = await resp.json();

  // { result: "success", fname: "nishad", lname"ranade", email:"nishad.ranade"}

  if( respJson.result == "success"){
    document.getElementById('fname3').innerHTML = respJson.fname;
    document.getElementById('lname3').innerHTML = respJson.lname;
    document.getElementById('email3').innerHTML = respJson.email;
    document.getElementById("invisibleDiv").style.display = "block";
  }
}
