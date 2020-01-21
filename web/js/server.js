class Server {

    constructor(id) {
        this.id = id;

        createHTML("Server", id)
    }

    get server_id() {
        return this.id;
    }

    set server_id(id) {
        this.id = id;
    }
}

function createHTML(name, id) {
    name = `${name}-${id}`

    // create div
    let div = document.createElement("div")

    // create header
    let header = document.createElement("h2");
    header.innerText = name

    // append header then div
    document.body.appendChild(header)
    document.body.appendChild(div)
}