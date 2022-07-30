const socketConstruc = require("socket.io");
class Socket {
    static connectSocket (server) {
        const io = socketConstruc(server, {
            cors: {
              origin: "http://localhost:8081",
              methods: ["GET", "POST"],
              transports: ['websocket', 'polling'],
              credentials: true
            },
            allowEIO3: true
          })
      let arrayUserOnline = []
      let id = ''
        io.on('connection', (socket) => {
            // console.log('có người kết nối')

            socket.on('setUserOnl', data => {
              arrayUserOnline.push({id: data.id, idSocket: socket.id})
              arrayUserOnline = Array.from(new Set(arrayUserOnline))
              console.log('arrayUserOnline', arrayUserOnline)
              io.emit('getUserOnl', arrayUserOnline)
            })

            socket.on('joinConversion', data => {
              socket.leave(id)
              socket.join(data._id)
              id = data._id
            })

            socket.on('sendMessage', data => {
              socket.join(data.conversion_id)
              socket.in(data.conversion_id).emit("getMessage", data)
            })
            // console.log(socket.handshake.headers)
            socket.on('disconnect', () => {
              let index = arrayUserOnline.findIndex(val => val.idSocket == socket.id)
              arrayUserOnline.splice(index, 1)
              io.emit('getUserOnl', arrayUserOnline)
            })

        })
    }

}

module.exports = Socket