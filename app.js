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
        res.render("indexprueba")
        
    })

    app.get("/buscado",function (req,res) {
        res.render("buscado",{datos:""})
        
    })


//Vistas POST --------------------------------------------


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
                
                console.log("X es igual a: ",x.imagen)

                //convertimos el blob de la imagen en png y lo guardamos en una carpeta
                fs.writeFileSync(path.join(__dirname,"./public/img/dbimages/"+x.id_prendas+x.nombre+".png"),x.imagen)

            }
           

            res.render("buscado",{datos:datos})
        } else {
            console.log("revisa avr")
            
        }})
})


//     app.get("/login", function (req, res) {
//         res.render("login", { msg: "Juan De Ore" })

//     })
//     app.get("/register", function (req, res) {
//         res.render("register", { msg: "Juan De Ore" })

//     })

// // Post para insertar nuevo usuario - HACER REGISTRO

// app.post("/register",async function (req,res) {
//     const nombres = req.body.nombres.toUpperCase()
//     const apellidos = req.body.apellidos.toUpperCase()
//     const password = req.body.password.toUpperCase()
//     const email = req.body.email.toUpperCase()
//     const telefono = req.body.telefono
//     const asunto = req.body.asunto.toUpperCase()
//     const necesidad = req.body.necesidad.toUpperCase()
//     let paswordHash= await bcryptjs.hash(password,8)

//     connection.query("INSERT INTO usuarios_registrados SET ?", { nombres: nombres,apellidos:apellidos,password:paswordHash, email:email, telefono:telefono,asunto:asunto,necesidad:necesidad},async function (error,results) {
//         if(error){
//             console.log("Error al registrar: ", error)
//             res.send("Hubo un error tecnico al momento de intentar realizar el registro bro, revisa avr...")
//         }else{
//             res.render("registrado")
// }   
        
//     })
    
// })

// // Post para iniciar sesion - AUTENTICACIÓN

// app.post("/auth",async (req,res)=>{
//     const nombres = req.body.nombres.toUpperCase() 
//     const apellidos = req.body.apellidos.toUpperCase()
//     const password = req.body.password.toUpperCase()
//     let paswordHash = await bcryptjs.hash(password,8)

//     if (nombres && apellidos && password){
//         connection.query('SELECT * FROM `usuarios_registrados` WHERE nombres ="' + nombres + '" AND apellidos ="' + apellidos +'"',async function (error, rows,fields) {
//             if (rows.length == 0 || !(await bcryptjs.compare(password,rows[0].password))){
//                 res.send("Usuario o contraseña incorrectas...")
//             }else{
//                 console.log("Se supone que pasó a index, logueo correcto xd")
//                 res.render("index")
//             }
//             // console.log("Rows: ",rows)
//             // console.log("Error: ", error)
//             // console.log("Fields: ", fields)
            
//         })
//     }

// })




app.listen(3000,(req,res)=>{
    console.log("Corriendo en el puerto 3000")
})
