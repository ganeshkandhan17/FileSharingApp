const url = "http://3.111.37.211/filesharingapp"
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
let filename = ""
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
file.addEventListener("change", (e) => {
    for (data of file.files) {
        formData.append('files', data);
        filename = filename + `${data.name},`
        filecount++;
        addupload(data.name, data.size, filecount)
        if (show == 0) {
            showuploadmenu()
            show++
        }
    }
})
function uploadall() {
    ani();
    hideuploadmenu()
    setTimeout(() => {
        shift()
        refreshhistory()
    }, 1000)
    let hr = new XMLHttpRequest()
    hr.open('post', '/upload', true)
    hr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            let percent = Math.floor((e.loaded / e.total) * 100);
            document.querySelector(".percent").innerHTML = percent + "%";
        }

    }
    hr.upload.onload = () => {
        hr.onload = () => {
            let path = hr.response
            postuploadpage(path)
        }
    }
    hr.send(formData)
    hr.onerror = (err) => {
        console.log(err)
    }
    if (!ohis) {
        setCookie(filename, 30)
    }
    else {
        setCookie(filename + ohis, 30)
    }
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
    filename = "";
    formData = new FormData()
    show = 0
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

function getqr(path) {
    fetch(`https://image-charts.com/chart?chs=150x150&cht=qr&chl=${url}/${path}/file`)
        .then((data) => {
            let img = document.createElement("img");
            img.className = "qr"
            let url = data.url;
            document.querySelector(".qr").src = url
            setTimeout(ani, 1000)
        })


}

function shift() {
    let cont1 = document.querySelector(".cont1")
    let cont2 = document.querySelector(".cont2")
    let txt = document.querySelector(".text")
    cont1.classList.toggle('active')
    cont2.classList.toggle('active')
    txt.classList.toggle('active')
}
function postuploadpage(path) {
    getqr(path);
    document.querySelector(".filecount").innerHTML = filecount;
    document.querySelector(".downloadlink").innerHTML = `${url}/${path}/file`
    document.querySelector(".downloadlink").href = `/${path}/file`
    document.querySelector(".downloadcode").innerHTML = path
}

function downloadpagenav() {
    window.location.href = "getfile"
}

function ani1() {
    document.querySelector(".pleasewaitpage").classList.toggle("showloading")
    document.querySelector(".container_7").classList.toggle("active")
}

function againupload() {
    ani1()
    setTimeout(() => {
        showuploadmenu()
        shift()
    }, 1000)

    setTimeout(ani1, 2000)

}


const dropContainer = document.querySelector('.cont1');
const fileInput = document.getElementById('file');

dropContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropContainer.classList.toggle("drag");
});

dropContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropContainer.classList.toggle("drag");
});

dropContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    const dataTransfer = new DataTransfer();

    for (let i = 0; i < files.length; i++) {
        console.log(files[i].name);
        dataTransfer.items.add(files[i]);
    }

    fileInput.files = dataTransfer.files;
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
})


