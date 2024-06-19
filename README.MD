### DESAFÍO ROOMMATES 

```
 Roommates” 😊.

```

## Instalar las dependencias para que nuestro código funcione:

npm i axios jquery express uuid

El servidor se inicia con:
node index.js

### DESAFÍO

```
 Se realizó un servidor con Node que sirve una interfaz HTML que tiene a disposición en el Apoyo Desafío - Roommates y cuya temática está basada en el registro de gastos entre roommates

```

### CONSULTAS CRUD

```
El código implementa un servidor HTTP que maneja las siguientes operaciones CRUD:

Para el recurso roommate:

POST /roommate - Agrega un nuevo roommate y lo guarda en un archivo JSON.
GET /roommate - Retorna todos los roommates almacenados en formato JSON.

Para el recurso gasto:
GET /gastos - Retorna todos los gastos almacenados en formato JSON.
POST /gasto - Crea un nuevo gasto y lo guarda en un archivo JSON.
PUT /gasto?id=<id> - Actualiza un gasto existente según el ID proporcionado en la consulta.
DELETE /gasto?id=<id> - Elimina un gasto según el ID proporcionado en la consulta.

El servidor también maneja la entrega del archivo index.html en la ruta principal (/) y gestiona errores devolviendo códigos de estado HTTP adecuados (404, 400, 500) cuando corresponde.

```