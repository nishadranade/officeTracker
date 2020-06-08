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

async function getData(){
  let name = document.getElementById("email").value;
  let startDate = document.getElementById('startDate').value;
  let endDate = document.getElementById('endDate').value;
// "00:00:00:000"  24 hour
  console.log(startDate);
  let startTime = startDate + " 00:00:00.000";
  let endTime = endDate + " 00:00:00.000";

  let data = { name: name, startTime: startTime, endTime: endTime};
  const resp = await postData("http://localhost:8080/getData", data);

    //For conference room table-
    // { rName, startTime, endTime}
    // Employee-
    // {fname, lname, roomName, startTime, endTime}
    // }
  const respJson = await resp.json();

  const logs = respJson.logs;
  const empLogs = respJson.empLogs;

  if(respJson.result != "success"){
    alert("no data on person for the times provided");
  }

  var logsTable = document.getElementById("logsTable");
  var row = logsTable.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "<b> Room Name </b>";
  cell2.innerHTML = "<b> Start Time </b>";
  cell3.innerHTML = "<b> End Time </b>";

  for(let i=0; i<logs.length; i++){
    var row = logsTable.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = logs[i][0];
    cell2.innerHTML = logs[i][1];
    cell3.innerHTML = logs[i][2];
  }

  var empTable = document.getElementById("empTable");
  var row = empTable.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  cell1.innerHTML = "<b> Name </b>";
  cell2.innerHTML = "<b> Room Name </b>";
  cell3.innerHTML = "<b> Start Time </b>";
  cell4.innerHTML = "<b> End Time </b>";

  for(let i=0; i<empLogs.length; i++){
    var row = empTable.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = empLogs[i][0];
    cell2.innerHTML = empLogs[i][1];
    cell3.innerHTML = empLogs[i][2];
    cell4.innerHTML = empLogs[i][3];
  }

}
