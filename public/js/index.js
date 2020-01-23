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

class ListenerSockets extends React.Component {

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
                    socket_ids: socket_ids,
                })
            })
        
    }

    render() {
        return (
            <div className="SocketsContainer">
                <h2>Listener Sockets</h2>
                {this.state.socket_ids.length > 0 && 
                    this.state.socket_ids.map((id, index) => {
                        return <Socket socket_id={id} />;
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

                <ListenerSockets server_id={this.props.id}/>
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
        fetch(`http://localhost:8080/socket?socket_id=${this.props.socket_id}`)
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
            <div className="Socket" id={this.props.socket_id}>
                <h3>Socket-{this.props.socket_id}</h3>
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
            num_events_logged: 0,
            channel_creation_timestamp: 0,
            subchannel_ids: [],
        }
    }

    componentDidMount() {

        const self = this;

        fetch(`http://localhost:8080/channel?channel_id=${this.props.channel_id}`)
            .then((response) => response.json())
            .then(function(json) {
                
                const target = json.data.target
                const events = json.data.trace.events
                const num_events_logged = json.data.trace.num_events_logged
                const channel_creation_timestamp = json.data.trace.creation_timestamp.seconds
                const subchannel_ids = json.subchannel_ref

                self.setState({
                    target: target,
                    events: events,
                    num_events_logged: num_events_logged,
                    channel_creation_timestamp: channel_creation_timestamp,
                    subchannel_ids: subchannel_ids,
                })
            })
    }

    render() {
        return (
            <div className="Channel" id={this.props.channel_id}>
                <h4>Channel-{this.props.channel_id}</h4>
                <p>target: {this.state.target}</p>

                <Events num_events_logged={this.state.num_events_logged} events={this.state.events}/>

                {this.state.subchannel_ids.length > 0 &&
                    this.state.subchannel_ids.map((id, index) => {
                        return <SubChannel subchannel_id={id.subchannel_id} />;
                    })
                }
            </div>
        )
    }
}

class SubChannel extends React.Component {

    constructor() {
        super();
        this.state = {
            target: "",
            events: [],
            sockets: [],
            num_events_logged: 0,
            subchannel_creation_timestamp: 0,
        }
    }

    componentDidMount() {

        const self = this;

        fetch(`http://localhost:8080/subchannel?subchannel_id=${this.props.subchannel_id}`)
            .then((response) => response.json())
            .then(function(json) {
                
                const target = json.data.target
                const events = json.data.trace.events
                const num_events_logged = json.data.trace.num_events_logged
                const subchannel_creation_timestamp = json.data.trace.creation_timestamp.seconds
                const sockets = json.socket_ref

                self.setState({
                    target: target,
                    events: events,
                    sockets: sockets,
                    num_events_logged: num_events_logged,
                    channel_creation_timestamp: subchannel_creation_timestamp,
                })
            })
    }

    render() {
        return (
            <div className="SubChannel" id={this.props.subchannel_id}>
                <h4>SubChannel-{this.props.subchannel_id}</h4>
                <p>target: {this.state.target}</p>

                {this.state.sockets.length > 0 && 
                    this.state.sockets.map((id, index) => {
                        return <Socket socket_id={id.socket_id} />;
                    })
                }

                <Events num_events_logged={this.state.num_events_logged} events={this.state.events}/>
            </div>
        )
    }
}

function Events(props) {
    return (
        <div className="Events">
           <h3>Events</h3>
           <p>number_of_events_logged: {props.num_events_logged}</p>
           {props.events.map((event, index) => {
               return <p>{index+1}: {event.description}</p>;
           })}
        </div>
    )
}

ReactDOM.render(<ServersContainer />, document.getElementById('root'))
