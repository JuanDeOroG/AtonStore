const express =require("express")
const app= express()
var fs = require('fs');

// seteamos para capturar los datos del formulario
app.use(express.urlencoded({extended:false}))
app.use(express.json())


const dotenv= require("dotenv")
dotenv.config({path:"./env/.env"})

app.use("/resources",express.static("public"))
app.use("/resources", express.static(__dirname + "/public"))
app.use("/img", express.static(__dirname + "/public/img"))


// Estableciendo motor de plantillas ejs
app.set("view engine", "ejs")

// BCRYPTJS
const bcryptjs = require("bcryptjs")

// EXPRES SESSION
const session = require("express-session")
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))

// MODULO DE CONECCION BD

const connection = require("./database/db");
const path = require("path");


// VISTAS GET
    app.get("/",function (req,res) {
        res.render("aton")
        
    })

    app.get("/buscado",function (req,res) {
        if (req.session.carrito) {
            carrito = req.session.carrito
            
        } else { carrito = false }
        res.render("buscado",{datos:"",carrito:carrito})
        
    })

    //GET DE NUESTRAS PRENDAS :^|

        app.get("/buso-fuego", (req,res)=>{
            res.render("nuestras_prendas/buso-fuego")
        })

        app.get("/shirt-white", (req, res) => {
            res.render("nuestras_prendas/shirt-white")})

        app.get("/shirt-black", (req, res) => {
            res.render("nuestras_prendas/shirt-black")
        })

        app.get("/prenda-casual", (req, res) => {
            res.render("nuestras_prendas/prenda-casual")
        })
        app.get("/chaqueta-jean", (req, res) => {
            res.render("nuestras_prendas/chaqueta-jean")
        })
        app.get("/buso-color", (req, res) => {
            res.render("nuestras_prendas/buso-color")
        })
        
//Vistas POST --------------------------------------------

app.post("/addcart", async function (req,res) {
    if (!req.session.carrito) {
        req.session.carrito = []
        let prenda= req.body.prenda
        req.session.carrito.push(prenda)
        console.log("Lista carrito: ", req.session.carrito)
        res.redirect("/buscado")

    } else { console.log("Ya fue creada la lista: ", req.session.carrito)
        let prenda = req.body.prenda
        req.session.carrito.push(prenda)
        console.log("Lista carrito: ", req.session.carrito)
        res.render("buscado",{carrito:req.session.carrito,datos:""})

}
    
})

app.post("/quitar", async function (req, res) {
    
        console.log("apunto de quitar una prenda ", req.session.carrito)
        let qprenda = req.body.qprenda
        console.log("La prenda por quitar es ",qprenda)
        let listaquitar = []

        for(x of req.session.carrito){

            if (x==qprenda) {
                console.log("se encontró",x," Y se quitará de la lista")
                
            }else{
                listaquitar.push(x)
            }
        }

        req.session.carrito = listaquitar


        // req.session.carrito = req.session.carrito.filter((qprenda) => qprenda == qprenda)

        
        console.log("Lista carrito: ", req.session.carrito)
        res.render("buscado", { carrito: req.session.carrito, datos: "" })

    

})



app.post("/buscado", async (req, res) => {

    const consulta= req.body.inputBuscar
    

    connection.query("SELECT * FROM prendas WHERE nombre LIKE  '%" + consulta + "%'" + " or estilo LIKE '%" + consulta + "%'"+" or descripcion LIKE '%" + consulta + "%'", async function (error, rows, fields) {
        if (rows.length != 0){
            //pasamos los resultados a la variable datos
            const datos = rows
            // console.log(datos);
            // console.clear()
            // let resultadosList= []
            for(let x of datos){
                

                //convertimos el blob de la imagen en png y lo guardamos en una carpeta
                fs.writeFileSync(path.join(__dirname,"./public/img/dbimages/"+x.id_prendas+x.nombre+".png"),x.imagen)

            }
           

            res.render("buscado", { datos: datos, carrito: false })
        } else {
            console.log("revisa avr")
            
        }})
})




app.listen(3000,(req,res)=>{
    console.log("Corriendo en el puerto 3000")
})
