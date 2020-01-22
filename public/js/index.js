class ServersContainer extends React.Component {

    constructor() {
        super();
        this.state = {ids: []};
    }

    componentDidMount() {

        let ids = []

        fetch("http://localhost:8080/servers")
            .then((response) => response.json())
            .then(function(data) { 

                // iterate over servers returned
                return data.map(function(s) {
                    let id = s.ref["server_id"];
                    ids.push(id)
                })
            })
        this.setState({ids: ids});
    }

    render() {
        return (
            <div>
                <h1>Channelz Web</h1>
                {this.state.ids.map((id, index) => {
                    return <Server id={id} />
                })}
            </div>
        )
    }
}

class Server extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id={this.props.id}>
                <h1>Server-{this.props.id}</h1>
            </div>
        );
    }
}

class Socket extends React.Component {
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
