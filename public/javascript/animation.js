document.getElementById("btn-menu").addEventListener("click", mostrar_menu);
document.getElementById("black-menu").addEventListener("click", ocultar_menu);

nav = document.getElementById("list");
background_menu = document.getElementById("black-menu");

function mostrar_menu(){
    list.style.right = '0px';
    background_menu.style.display ="block";
}

function ocultar_menu(){
    list.style.right = '-250px';
    background_menu.style.display ="none";
}