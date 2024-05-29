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
function showuploadmenu() {
    document.querySelector(".showdtl").classList.toggle("showmenu")
}
function hideuploadmenu() {
    document.querySelector(".showdtl").classList.toggle("showmenu")
}
document.querySelector(".text").addEventListener("click", () => {
    document.querySelector(".inputfile").click()
})

let formData = new FormData()
let file = document.querySelector("#file")
let tbody = document.querySelector(".tbody")
let show = 0;
let filecount = 0
let ohis
let filename=""
try {
    ohis = document.cookie;
    ohis = ohis.toString();
    ohis = ohis.split("=");
    ohis = ohis[1];
    ohis=ohis.substring(0,ohis.length-1)
}
catch (err) {
    addhistory("No History Found")
}
file.addEventListener("change", (e) => {
    for (let data of file.files) {
        formData.append('files', data);
        filename = filename + `${data.name},`
        filecount++;
        addupload(data.name, data.size, filecount)
        if (show == 0) {
            showuploadmenu()
            show++
        }
    }
    if(!ohis){
        setCookie(filename, 30)
        console.log("Filename  if entered"+filename)
    }
    else{
        setCookie(filename+ohis, 30)
        console.log("Hitory if "+ filename +ohis)
    }

})
function uploadall() {
    ani();
    let hr = new XMLHttpRequest()
    hr.open('post', '/upload', true)
    hr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            let percent = Math.floor((e.loaded / e.total) * 100);
            document.querySelector(".percent").innerHTML = percent + "%";
        }

    }
    hr.upload.onload = () => {
        setTimeout(ani, 1000);

    }
    hr.send(formData)
}
function addupload(name, size, count) {
    size = Math.ceil(size / 1024)
    if (size > 1000) {
        size = Math.ceil(size / 1024) + " mb"
    }
    else {
        size = Math.ceil(size) + " kb"
    }
    let r = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.innerHTML = name;
    td2.innerHTML = `${count} / ${size}`;
    r.appendChild(td1);
    r.appendChild(td2);
    document.querySelector(".tbody").appendChild(r);
}

function removeall() {
    let tbody = document.querySelector(".tbody")
    hideuploadmenu()
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
    }
    formData = new FormData()
    filecount = 0
}

function ani() {
    document.querySelector(".loadingpage").classList.toggle("showloading")
    document.querySelector(".container_1").classList.toggle("active")
}

function getDate() {
    let date = new Date()
    date = date.toUTCString()
    date = date.split(" ")
    date = `${date[2]} / ${date[3]}`
    return date
}

function setCookie(filename, days) {
    let date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    date = date.toUTCString()
    document.cookie = `history=${filename};expires=${date};path=/`
}

function addhistory(name) {
    let tbody = document.querySelector(".tbody_2");
    let tr1 = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerHTML = name;
    tr1.appendChild(td1);
    tbody.appendChild(tr1);
}

let his = document.cookie;
his = his.toString();
his = his.split("=");
his = his[1]
his = his.split(",")
his.forEach((data) => {
    addhistory(data)
});



