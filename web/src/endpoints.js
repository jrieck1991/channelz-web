// get all servers
function servers() {

    // call servers endpoint
    fetch("http://localhost:8080/servers")
        .then((response) => response.json())
        .then(function(data) { 
            
            // iterate over servers returned
            return data.map(function(s) {
                let id = s.ref["server_id"];
                server(id);
                server_sockets(id);
            })
        })
}

// detail about a specific server
function server(server_id) {

    fetch(`http://localhost:8080/server?server_id=${server_id}`)
        .then((response) => response.json())
        .then(function(data) {
            elementAction(`Server-${server_id}`, data)
        })
}

// return all server sockets
function server_sockets(server_id) {
    fetch(`http://localhost:8080/server_sockets?server_id=${server_id}`) 
        .then((response) => response.json())
        .then(function(data) {

            // iterate over sockets
            return data.map(function(s) {
                socket(s.socket_id);
                //elementAction(`Server-${server_id}`, data)
            })
        })
}

// detail about a specific socket
function socket(socket_id) {
    fetch(`http://localhost:8080/socket?socket_id=${socket_id}`)
        .then((response) => response.json())
        .then(function(data) {
            elementAction(`Socket-${socket_id}`, data)
        })
}

// get all channels
function topchannels() {
    fetch(`http://localhost:8080/topchannels`)
        .then((response) => response.json())
        .then(function(data) {
            return data.map(function(chan) {
                channel(chan.ref.channel_id)
            })
        })
}

// detail about a channel
function channel(channel_id) {
    fetch(`http://localhost:8080/channel?channel_id=${channel_id}`)
        .then((response) => response.json())
        .then(function(data) {
           elementAction(`Channel-${channel_id}`, data)
           let idsMap = JSON.parse(JSON.stringify(data.subchannel_ref));
           subchannels(idsMap)
        })
}

// detail about an array of subchannels
function subchannels(subchannel_ids) {
    for (i = 0; i < subchannel_ids.length; i++) {
        let id = JSON.stringify(subchannel_ids[i]["subchannel_id"])
        fetch(`http://localhost:8080/subchannel?subchannel_id=${id}`)
            .then((response) => response.json())
            .then(function(data) {
                elementAction(`SubChannel-${id}`, data)
            })
    }
}

// create or replace an element if it already exists
function elementAction(name, json_data) {

    let element = document.getElementById(name);

    // if element is not undefined or null it exists
    if(typeof(element) != 'undefined' && element != null) {
        replaceElement(name, json_data)
    } else {
        createElement(name, json_data)
    }
}

// create element and append json data
function createElement(name, json_data) {

    // create element for the json
    let element = document.createElement("div");
    element.id = name // used by replaceElement
    let content = document.createTextNode(JSON.stringify(json_data));
    element.appendChild(content)

    // create header
    let header = document.createElement("h2");
    header.innerText = name

    // append header containing div
    document.body.appendChild(header)
    document.body.appendChild(element)
}

// replace element text with new json data
function replaceElement(name, json_data) {
    let element = document.getElementById(name);
    element.textContent = JSON.stringify(json_data);
}