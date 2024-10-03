import net from 'net';

function scanPort(host, port, timeout = 3000) {
    //We'll be returning promise obects for each socket
    return new Promise((resolve, reject) => {
        //We initialize a new socket on out system then 
        const socket = new net.Socket()
        let status = "closed"
        socket.setTimeout(timeout)

        //Handling events

        socket.on("connect", () => {
            status = "open"
            socket.destroy()
        })

        socket.on("timeout", () => {
            socket.destroy()
        })

        socket.on("error", () => {
            socket.destroy()
        })

        socket.on("close", () => {
            resolve({ port, status })
        })

        //Trying the connection
        socket.connect(port, host)

    })
}

export function scanPorts(host, portList = [80, 8080, 3000, 5000]) {
    const allPromises = portList.map((port) => {
        return scanPort(host, port)
    })

    Promise.all(allPromises)
        .then((results) => {
            results.forEach((result) => {
                console.log(`Port ${result.port} is ${result.status}`)
            })
        })
        .catch((error) => {
            console.error("Error scanning ports", error)
        })
}