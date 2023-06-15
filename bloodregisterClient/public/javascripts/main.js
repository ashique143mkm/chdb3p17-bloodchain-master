//Navigation Bar
document.getElementById("navMenu").innerHTML =
  '<nav class="navbar navbar-expand-md navbar-dark" style="background-color: #5a173b">' +
  '<div class="container-fluid">' +
  '<ul class="nav navbar-nav">' +
  "<li>" +
  '<a class="nav-link"  id="home" href="/selectfunction">Home   </a>' +
  "</li>" +
  "<li>" +
  '<a class="nav-link" id="create" href="/createblood">Create blood    </a>' +
  "</li>" +
  "<li>" +
  '<a class="nav-link" id="acquire" href="/acquireblood">Acquire blood   </a>' +
  "</li>" +
  "<li>" +
  '<a class="nav-link" id="view" href="/viewblood">View blood    </a>' +
  "</li>" +
  "</ul>" +
  '<ul class="nav navbar-nav navbar-right">' +
  '<li class="nav-item"><a class="nav-link" href="/" onclick="logout()">Logout</a></li>' +
  "</ul>" +
  "</div>" +
  "</nav>";

function login_user(event) {
  event.preventDefault();
  let p_key = document.getElementById("login_id").value;

  $.post(
    "/",
    { pri_key: p_key.trim() },
    (data, textStatus, jqXHR) => {
      if (data.done == 1) {
        sessionStorage.clear();
        sessionStorage.setItem("privatekey", data.privatekey);
        alert(data.message);
        window.location.href = "/selectfunction";
      } else {
        alert(data.message);
        // alert("Invalid Key!")
        window.location.href = "/";
      }
    },
    "json"
  );
}

function uploadFunction(event) {
  event.preventDefault();
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function uploadFunction(event) {
    var Key = event.target.result;
    console.log("Key=" + Key);
    $.post(
      "/",
      { pri_key: Key.trim() },
      (data, textStatus, jqXHR) => {
        if (data.done == 1) {
          sessionStorage.clear();
          sessionStorage.setItem("privatekey", data.privatekey);
          alert(data.message);
          window.location.href = "/selectfunction";
        } else {
          alert(data.message);
          window.location.href = "/";
        }
      },
      "json"
    );
  };
  reader.readAsText(file);
}

function logout(event) {
  event.preventDefault();
  sessionStorage.clear();
  window.location.href = "/";
}

function addblood(event) {
  event.preventDefault();

  const p_key = sessionStorage.getItem("privatekey");
  let _bloodName = document.getElementById("bloodname").value;
  let _bloodType = document.getElementById("bloodtype").value;
  if (_bloodName != "" && _bloodType != "") {
    $.post(
      "/bloods",
      {
        pri_key: p_key,
        blood_name: _bloodName.trim(),
        blood_type: _bloodType.trim(),
        alloted: "false"
      },
      (data, textStatus, jqXHR) => {
        // alert(data.message);
      },
      "json"
    );
    setTimeout(function() {
      document.location.reload();
    }, 400);
  } else {
    alert("Incomplete data!");
  }
}

function acquireblood(event) {
  event.preventDefault();

  const p_key = sessionStorage.getItem("privatekey");
  let _bloodName = document.getElementById("acquirebloodname").value;
  // alert(_bloodName);
  if (_bloodName.trim() != "") {
    $.post(
      "/acquirebloods",
      { pri_key: p_key, blood_name: _bloodName.trim() },
      (data, textStatus, jqXHR) => {
        // alert(data.message);
      },
      "json"
    );
    setTimeout(function() {
      document.location.reload();
    }, 400);
  } else {
    alert("Incomplete data!");
  }
}
