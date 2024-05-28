let menuicon = document.querySelector(".menuicon");
let history = document.querySelector(".history");
let body = document.querySelector("body");
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
let filecount=0;
file.addEventListener("change", (e) => {
    for (data of file.files) {
        formData.append('files', data);
        addupload(data.name, data.size)
        if(filecount==0){
            showuploadmenu()
            filecount++
        }
    }
})
function uploadall() {
    ani();
    let hr=new XMLHttpRequest()
    hr.open('post','/upload',true)
    hr.upload.onprogress=(e)=>{
        if(e.lengthComputable){
            let percent=Math.floor((e.loaded/e.total)*100);
            document.querySelector(".percent").innerHTML=percent + "%";
        }
        
    }
    hr.upload.onload=()=>{
        setTimeout(ani,3000);
        
    }
    hr.send(formData)
}
function addupload(name, size) {
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
    td2.innerHTML = size;
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
    formData=new FormData()
    filecount=0
}

function ani(){
    document.querySelector(".loadingpage").classList.toggle("showloading")
    document.querySelector(".container_1").classList.toggle("active")
}