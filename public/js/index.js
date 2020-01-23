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
            <div className="ServersContainer">
                <h1>Channelz Web</h1>
                {this.state.ids.map((id, index) => {
                    return <Server id={id} />;
                })}
            </div>
        )
    }
}

class ListenerSocketsContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            socket_ids: [],
        }
    }

    componentDidMount() {

        const socket_ids = []
        const self = this;

        // get detailed server data and parse for listen sockets
        fetch(`http://localhost:8080/server?server_id=${this.props.server_id}`)
            .then((response) => response.json())
            .then(function(json) {

                json.listen_socket.map(function(s) {
                    const id = s.socket_id
                    socket_ids.push(id)
                })

                self.setState({
                    listen_socket_ids: socket_ids,
                })
            })
        
    }

    render() {
        return (
            <div className="SocketsContainer">
                <h4>Listener Sockets</h4>
                {this.state.socket_ids.length > 0 && 
                    this.state.socket_ids.map((id, index) => {
                        return <Socket id={id} />;
                    })
                }
            </div>
        )
    }

}

class ChannelsContainer extends React.Component {
    
    constructor() {
        super();
        this.state = {
            channel_ids: [],
        };
    }

    componentDidMount() {

        const ids = [];
        const self = this;

        fetch(`http://localhost:8080/topchannels`)
            .then((response) => response.json())
            .then(function(json) {
                
                json.map(function(chan) {
                    const id = chan.ref.channel_id
                    ids.push(id)
                })

                self.setState({
                    channel_ids: ids,
                })
            })
    }

    render() {
        return (
            <div className="ChannelsContainer">
                <h2>Channels</h2>
                {this.state.channel_ids.map((id, index) => {
                    return <Channel channel_id={id} />;
                })}
            </div>
        )
    }
}
//class SubChannelsContainer extends React.Component {}

class Server extends React.Component {

    constructor() {
        super();
        this.state = {
            calls_started: 0,
            calls_succeeded: 0,
            last_call_started_timestamp: 0,
        }
    }

    componentDidMount() {
        
        const self = this;

        // get detailed server data
        fetch(`http://localhost:8080/server?server_id=${this.props.id}`)
            .then((response) => response.json())
            .then(function(json) {

                const calls_started = json.data.calls_started;
                const calls_succeeded = json.data.calls_succeeded;
                const last_call_started_timestamp = new Date(json.data.last_call_started_timestamp.seconds * 1000).toISOString();

                self.setState({
                    calls_started: calls_started,
                    calls_succeeded: calls_succeeded,
                    last_call_started_timestamp: last_call_started_timestamp,
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

                <ListenerSocketsContainer server_id={this.props.id}/>
                <ChannelsContainer />
            </div>
        );
    }
}

class Socket extends React.Component {

    constructor() {
        super();
        this.state = {
            data: "",
        }
    }

    componentDidMount() {

        const self = this;

        // get detailed socket data
        fetch(`http://localhost:8080/socket?socket_id=${this.props.id}`)
            .then((response) => response.json())
            .then(function(json) {
                self.setState({
                    ip_address: json.local.Address.TcpipAddress.ip_address,
                    port: json.local.Address.TcpipAddress.port, 
                })
        })

    }

    render() {
        return (
            <div className="Socket" id={this.props.id}>
                <h3>Socket-{this.props.id}</h3>
                <p>{this.state.ip_address}:{this.state.port}</p>
            </div>
        )
    }
}

class Channel extends React.Component {

    constructor() {
        super();
        this.state = {
            target: "",
            events: [],
            subchannel_ids: [],
        }
    }

    componentDidMount() {

        const self = this;

        fetch(`http://localhost:8080/channel?channel_id=${this.props.channel_id}`)
            .then((response) => response.json())
            .then(function(json) {
                
                const target = json.data.target
                const events = json.data.events
                const subchannel_ids = json.data.subchannel_ref

                self.setState({
                    target: target,
                    events: events,
                    subchannel_ids: subchannel_ids,
                })
            })
    }

    render() {
        return (
            <div className="Channel" id={this.props.channel_id}>
                <h4>Channel-{this.props.channel_id}</h4>
                <p>target: {this.state.target}</p>

                <h3>Events</h3>
                <ul>
                {this.state.events && 
                    this.state.events.map((event, index) => {
                    <li>{index+1}-{event}</li>
                })}
                </ul>
            </div>
        )
    }
}

class SubChannel extends React.Component {
    render() {
    }
}

ReactDOM.render(<ServersContainer />, document.getElementById('root'))
