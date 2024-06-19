const url = require("url");
const http = require("http");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { agregaRoommate, guardarRoommate } = require("./usuarios");

// Creación del servidor HTTP
const server = http.createServer((req, res) => {
    if(req.url == "/" && req.method === "GET") {
        try {
            const indexPath = './index.html'; // Ruta correcta al archivo index.html
            if (fs.existsSync(indexPath)) {
                res.setHeader("Content-Type", "text/html");
                res.end(fs.readFileSync(indexPath, "utf8"));
            } else {
                res.statusCode = 404;
                res.end('File not found');
            }
        } catch (err) {
            console.error('Error reading index.html:', err);
            res.statusCode = 500;
            res.end('Server error');
        }
        return; // End the request handling here for "/"
    }
  
    if(req.url.startsWith('/roommate') && req.method === 'POST') {
        agregaRoommate().then(async (roommate) => {
            guardarRoommate(roommate);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(roommate));
        }).catch((e) => {
            res.statusCode = 500;
            res.end();
            console.log("Error en el registro", e);
        });
        return; // finaliza "/roommate POST"
    }

    if(req.url.startsWith('/roommate') && req.method === 'GET') {
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(roommatesJSON));
        return; // End the request handling for "/roommate GET"
    }

    // Manejo de la API REST para gastos--------------------------------//
    let gastosJSON = JSON.parse(fs.readFileSync('./gastos.json', 'utf8'));
    let gastos = gastosJSON.gastos || [];
    
    // a. GET /gastos:
    if(req.url.startsWith('/gastos') && req.method === 'GET') {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(gastosJSON, null, 1));
        return; // End the request handling for "/gastos GET"
    }

    // b. POST /gasto:
    if(req.url.startsWith('/gasto') && req.method === 'POST') {
        let body = '';
        req.on('data', (payload) => {
            body += payload.toString();
        });

        req.on('end', () => {
            try {
                const bodyObj = JSON.parse(body);
                const descripcion = bodyObj.descripcion.trim(); // Limpiar y obtener la descripción

                // Validar que la descripción contenga al menos una letra
                if (!/[a-zA-Z]/.test(descripcion)) {
                    res.statusCode = 400; // Bad Request
                    res.end('La descripción debe incluir al menos una letra.');
                    return;
                }

                const gasto = {
                    id: uuidv4().slice(0, 8),
                    roommate: bodyObj.roommate,
                    descripcion: descripcion,
                    monto: bodyObj.monto
                };

                gastos.push(gasto);
                gastosJSON.gastos = gastos;
                fs.writeFileSync('./gastos.json', JSON.stringify(gastosJSON, null, 2));
                
                res.end('Gasto registrado con éxito');
                console.log('El Gasto ha sido registrado con éxito!');
            } catch (error) {
                res.statusCode = 500; // Internal Server Error
                res.end('Error interno al procesar la solicitud');
                console.error('Error processing POST /gasto:', error);
            }
        });
        return; // End the request handling for "/gasto POST"
    }

    // c. PUT /gasto:
    if(req.url.startsWith('/gasto') && req.method === 'PUT') {
        let body = '';
        const { id } = url.parse(req.url, true).query;

        req.on('data', (payload) => {
            body += payload.toString();
        });

        req.on('end', () => {
            try {
                const bodyObj = JSON.parse(body);
                const descripcion = bodyObj.descripcion.trim(); // Limpiar y obtener la descripción

                // Validar que la descripción contenga al menos una letra
                if (!/[a-zA-Z]/.test(descripcion)) {
                    res.statusCode = 400; // Bad Request
                    res.end('La descripción debe incluir al menos una letra.');
                    return;
                }

                bodyObj.id = id;

                gastosJSON.gastos = gastos.map((g) => {
                    if (g.id === bodyObj.id) {
                        return bodyObj;
                    }
                    return g;
                });
                
                fs.writeFileSync('./gastos.json', JSON.stringify(gastosJSON, null, 2));
                res.end('Gasto actualizado con éxito');
            } catch (error) {
                res.statusCode = 500; // Internal Server Error
                res.end('Error interno al procesar la solicitud');
                console.error('Error processing PUT /gasto:', error);
            }
        });
        return; // End the request handling for "/gasto PUT"
    }

    // d. DELETE /gasto:
    if(req.url.startsWith('/gasto') && req.method === 'DELETE') {
        const { id } = url.parse(req.url, true).query;
        gastosJSON.gastos = gastos.filter((g) => g.id !== id);
        fs.writeFileSync('./gastos.json', JSON.stringify(gastosJSON, null, 2));
        
        res.end('Gasto eliminado con éxito');
        console.log('Se eliminó el Gasto del historial con éxito!');
        return; // End the request handling for "/gasto DELETE"
    }

    // Si se llega aquí, ninguna ruta coincide
    res.statusCode = 404;
    res.end('Ruta no encontrada');
});

// Escuchar en el puerto 3000 y mostrar mensaje
server.listen(3000, () => {
    console.log('Servidor corriendo en el puerto http://localhost:3000');
});