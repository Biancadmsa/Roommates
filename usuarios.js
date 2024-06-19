const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const agregaRoommate = async () => {
    try{
       const {data} = await axios.get("https://randomuser.me/api/");
       const roommate = data.results[0];
       const user = {
        id: uuidv4().slice(30),
        nombre: `${roommate.name.title} ${roommate.name.first} ${roommate.name.last}`,
        correo: `${roommate.email}`,
        debe:`${(Math.floor(Math.random() * -10)+1)*1500}`,
        recibe:`${(Math.floor(Math.random() * 10)+1)*1500}`
    }
    return user;   
    } catch (e){
        throw e;
    }

};

const guardarRoommate = (roommate) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    roommatesJSON.roommates.push(roommate);
    fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON, null, 1));
};

module.exports = {agregaRoommate, guardarRoommate};