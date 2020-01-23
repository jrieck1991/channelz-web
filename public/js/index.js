class ServersContainer extends React.Component {

    constructor() {
        super();
        this.state = {ids: []};
    }

    componentDidMount() {

        const ids = []
        const self = this;
        fetch("http://localhost:8080/servers")
            .then((response) => response.json())
            .then(function(data) { 

                // iterate over servers returned
                data.map(function(s) {
                    const id = s.ref["server_id"];
                    ids.push(id)
                })

                self.setState({ids: ids});
            })
    }

    render() {
        return (
            <div>
                <h1>Channelz Web</h1>
                {this.state.ids.map((id, index) => {
                    return <Server id={id} />;
                })}
            </div>
        )
    }
}

class Server extends React.Component {

    constructor() {
        super();
        this.state = {
            calls_started: 0,
            calls_succeeded: 0,
            last_call_started_timestamp: 0,
            listen_sockets: [],
        }
    }

    componentDidMount() {
        
        const self = this;

        // get detailed server data
        fetch(`http://localhost:8080/server?server_id=${this.props.id}`)
            .then((response) => response.json())
            .then(function(json) {

                // remove
                const calls_started = json.data.calls_started;
                const calls_succeeded = json.data.calls_succeeded;
                const last_call_started_timestamp = json.data.last_call_started_timestamp.seconds; // there is also nano seconds field == nanos
                const listen_sockets = json.listen_socket;

                self.setState({
                    calls_started: calls_started,
                    calls_succeeded: calls_succeeded,
                    last_call_started_timestamp: last_call_started_timestamp,
                    listen_sockets: listen_sockets,
                });
            })
    }

    render() {

        return (
            <div className="Server" id={this.props.id}>
                <h1>Server-{this.props.id}</h1>

                <p>calls_started: {this.state.calls_started}</p>
                <p>calls_succeeded: {this.state.calls_succeeded}</p>
                <p>last_call_started: {this.state.last_call_started_timestamp}</p>
                {this.state.listen_sockets.length > 0 && 
                    this.state.listen_sockets.map((socket, index) => {
                        //return <Socket id={socket.socket_id} name={socket.name} />;
                    })
                }
            </div>
        );
    }
}

class Socket extends React.Component {

    constructor() {
        super();
        this.state = {
            data: {},
        }
    }

    componentDidMount() {

        const self = this;

        const url = `http://localhost:8080/socket?socket_id=${this.props.id}`

        // get detailed socket data
        fetch(url)
            .then((response) => response.json())
            .then(function(json) {
                self.setState({
                    data: json.data,
                })
        })

    }

    render() {
    }
}

class Channel extends React.Component {
    render() {
    }
}

class SubChannel extends React.Component {
    render() {
    }
}

ReactDOM.render(<ServersContainer />, document.getElementById('root'))
