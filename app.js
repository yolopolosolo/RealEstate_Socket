import {Server} from "socket.io";

const io = new Server({
    cors:{
        origin:"http://localhost:5173"
    }
});


let onlineUsers = [];

const addUser = (userId,socketId)=>{

    const user =  onlineUsers.find(user=>user.userId === userId);
    if(!user) onlineUsers.push({userId,socketId})

}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

const getUser = (userId)=>{
    return onlineUsers.find((user)=>user.userId==userId);
}

io.on("connection",(socket)=>{
    socket.on("newUser",(userId)=>{
        addUser(userId,socket.id);
    });

    socket.on("sendMessage",({receiverId,data})=>{
        const receiver = getUser(receiverId);
        if(receiver) io.to(receiver.socketId).emit("getMessage", data);
        
    })

    socket.on("disconnect",()=>{
        removeUser(socket.id)
    });
})

io.listen("4000");