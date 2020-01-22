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

    getData() {
        let response = server(this.id)
        response.then((response) => response.json())
            .then(function(data) {
                replaceElement(`Server-${this.id}`, data)
            })
    }
}

function createHTML(name, id) {
    name = `${name}-${id}`

    // create div
    let div = document.createElement("div")
    div.id = name

    // create header
    let header = document.createElement("h2");
    header.innerText = name

    // append header then div
    document.body.appendChild(header)
    document.body.appendChild(div)
}

function createServers(response) {

    response.then((response) => response.json())
        .then(function(data) {
            data.map(function(s) {
                let id = s.ref["server_id"]
                console.log("creating server class with id:", id)
                new Server(id)
            })
        })
}
