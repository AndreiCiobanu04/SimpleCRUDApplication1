var express = require("express");
var app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors());
app.use(bodyParser.json());


app.listen(3010,() => {
    console.log("Server running on port 3010");
});

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'andrei',
    port: '3306',
    database: 'pai_marire',
    

});

connection.connect(function(err){
    if(!err){
        console.log('Connected to MySQL');
    }
    else if(err){
        return console.error('Timeout: ' + err.message);
    }
});

app.get("/allCatedre", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.catedra", (err, response)=>{
        res.send(response);
    });
});

app.get("/specificCatedra/:idCatedra", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.catedra WHERE id = ?", req.params.idCatedra, (err, response)=>{
        res.send(response);
    });
});

app.get("/allProfesori", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.profesor", (err, response)=>{
        res.send(response);
    });
});

app.get("/specificProfesor/:idProfesor", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.profesor WHERE id = ?", req.params.idProfesor, (err, response)=>{
        res.send(response);
    });
});


app.get("/catedreForSpecificProfesor/:idProfesor", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.catedra WHERE id IN (SELECT catedra_id FROM pai_marire.profesor_catedra WHERE profesor_id = ?)", req.params.idProfesor, (err, response)=>{
        res.send(response);
    })
})

app.get("/profesoriForSpecificCatedra/:idCatedra", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.profesor WHERE id IN (SELECT profesor_id FROM pai_marire.profesor_catedra WHERE catedra_id = ?)", req.params.idCatedra, (err, response)=>{
    res.send(response);
     })
})


app.post("/addProfesor", (req, res)=>{
    connection.query("INSERT INTO pai_marire.profesor SET ?", req.body, (err,response)=>{
        res.send(response);
    });
});

app.post("/addCatedra", (req, res)=>{
    connection.query("INSERT INTO pai_marire.catedra SET ?", req.body, (err, response)=>{
        res.send(response);
    })
})

app.post("/addProfesorCatedra", (req, res)=>{

    connection.query("INSERT INTO pai_marire.profesor_catedra SET ?", req.body, (err, response)=>{
        connection.query("SELECT membri FROM pai_marire.catedra WHERE id=?", req.body.catedra_id, (err, r)=>{
            connection.query("UPDATE pai_marire.catedra SET membri=? WHERE id=?", [r[0].membri + 1, req.body.catedra_id], (err, rasp)=>{
                console.log( r[0].membri)
           })
        }) 
       res.send(response);
    })
})

app.get("/catedreAvailableForSpecificProfesor/:idProfesor", (req, res)=>{
    connection.query("SELECT * FROM pai_marire.catedra WHERE id NOT IN (SELECT catedra_id FROM pai_marire.profesor_catedra WHERE profesor_id = ?)", req.params.idProfesor, (err, response)=>{
        res.send(response);
    })
})

app.get("/profesoriAvailableForSpecificCatedra/:idCatedra", (req, res) =>{
    connection.query("SELECT * FROM pai_marire.profesor WHERE id NOT IN (SELECT profesor_id FROM pai_marire.profesor_catedra WHERE catedra_id = ?)", req.params.idCatedra, (err, response)=>{
        res.send(response);
    })
})

app.delete("/deleteProfesor", (req, res)=>{
    connection.query("DELETE FROM pai_marire.profesor_catedra WHERE profesor_id = ?", req.body.profesor_id, (err, response)=>{
        connection.query("DELETE FROM pai_marire.profesor WHERE id =?", req.body.profesor_id, (err, r)=>{
            res.send(r);
        });
    });
});

app.delete("/deleteCatedra", (req, res)=>{
    connection.query("DELETE FROM pai_marire.profesor_catedra WHERE catedra_id = ?", req.body.catedra_id, (err, response)=>{
        connection.query("DELETE FROM pai_marire.catedra WHERE id=?", req.body.catedra_id, (err, r)=>{
            res.send(r);
        })
    })
})

app.delete("/deleteProfesorCatedra", (req, res)=>{
    connection.query("DELETE FROM pai_marire.profesor_catedra WHERE profesor_id=? AND catedra_id=?", [req.body.profesor_id, req.body.catedra_id], (err, response)=>{
        connection.query("SELECT membri FROM pai_marire.catedra WHERE id=?", req.body.catedra_id, (err, r)=>{
            connection.query("UPDATE pai_marire.catedra SET membri=? WHERE id=?", [r[0].membri - 1, req.body.catedra_id], (err, rasp)=>{
            })
        })
    res.send(response);
    })
});

app.post("/updateProfesor", (req, res)=>{
    connection.query("UPDATE pai_marire.profesor SET ? WHERE id= ?", [req.body, req.body.id], (err, response)=>{
        res.send(response);
    });
});

app.post("/updateCatedra", (req, res)=>{
    connection.query("UPDATE pai_marire.catedra SET ? WHERE id=?", [req.body, req.body.id], (err, response)=>{
        res.send(response);
    })
})














