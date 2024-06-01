window.onload = refreshhistory()
function refreshhistory() {
    delethistory()
    try {
        ohis = getCookie("history");
        ohis = ohis.toString();
        ohis = ohis.substring(0, ohis.length - 1)
        let his = getCookie("history");
        his = his.toString();
        his = his.split(",")
        his.forEach((data) => {
            if (!data == " ") {
                addhistory(data)
            }
        });
    }
    catch (err) {
        addhistory("No History Found")
    }
}

function getCookie() {
    let name = "history" + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}

function delethistory() {
    let temp = document.querySelector(".tbody_2");
    while (temp.firstChild) {
        temp.removeChild(temp.firstChild)
    }
}

function addhistory(name) {
    let tbody = document.querySelector(".tbody_2");
    let tr1 = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerHTML = name;
    tr1.appendChild(td1);
    tbody.appendChild(tr1);
}

let menuicon = document.querySelector(".menuicon");
let history = document.querySelector(".history");
let closeicon = document.querySelector(".closeicon");
menuicon.addEventListener("click", showmenu)
closeicon.addEventListener("click", hidemenu)
function showmenu() {
    history.classList.toggle("showmenu")
}
function hidemenu() {
    history.classList.toggle("showmenu")
}

function uploadpagenav() {
    window.location.href = "/"
}

function showalert(content) {
    document.querySelector(".alertcontent").innerHTML = content
    document.querySelector(".alert").classList.toggle('showalert')
    document.querySelector(".line").classList.add("active")
    setTimeout(closealert, 2000)
}

function closealert() {
    document.querySelector(".alert").classList.toggle('showalert')
    document.querySelector(".line").classList.remove("active")
}

function codecheck() {
    let input = document.querySelector('.code')
    if (input.value == "") {
        showalert("Enter Download Code");
    }
    else if (input.value.length < 4) {
        showalert("Enter Valid Download Code")
    }
    else {
        let xhr = new XMLHttpRequest()
        xhr.open('post', '/checkcode');
        xhr.responseType = "text";
        localStorage.setItem('code', input.value)
        xhr.setRequestHeader('Content-Type', 'application/json');
        let json = {
            code: input.value
        }
        console.log(JSON.stringify(json))
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
            let res = xhr.response
            if (res == "true") {
                window.location.href = `/${input.value}/file`
            }
            else if (res == "false") {
                showalert("Enter Valid Code")
            }
        }

    }

}

function downloadWithProgress() {
    ani();
      let code = document.querySelector(".code").innerHTML;
      let url = `/${code}/download`;

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      xhr.onprogress = function(event) {
        console.log(event)
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          document.getElementById('progress').innerText = `Downloaded: ${percentComplete.toFixed(2)}%`;
        }
      };

      xhr.onload = function() {
        ani()
        if (xhr.status === 200) {
          const blob = xhr.response;
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = downloadUrl;
          a.download = `${code}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
        } else {
          console.error('Download failed:', xhr.statusText);
        }
      };

      xhr.onerror = function() {
        console.error('Network error');
      };

      xhr.send();
    }

function ani(){
    document.querySelector(".loadingpage").classList.toggle("showloading")
    document.querySelector(".container_1").classList.toggle("active")
}