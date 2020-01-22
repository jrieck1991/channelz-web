import { getServerIDs } from './endpoints.js'

class ServersContainer extends react.Component {
    constructor() {
        super();
    }

    render() {

        // get server ids
        let ids = getServerIDs()

        let servers = []

        for (i = 0; i < ids.length; i++) {
            servers.push(<li>{ids[i]}</li>)
        }

        return (
            <div>
                <h1>Channelz Web</h1>
                <ul>
                    {servers}
                </ul>
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
            <div>
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

ReactDOM.render(<Server />, document.getElementById('root'))
