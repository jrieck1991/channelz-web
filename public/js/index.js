//import * as endpoints from './endpoints.js';

class ServersContainer extends React.Component {
    constructor() {
        super();
    }

    render() {

        // get server ids
        //let ids = getServerIDs()

        return (
            <div>
                <h1>Channelz Web</h1>
                {ids.map((id, index) => {
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

ReactDOM.render(<ServersContainer />, document.getElementById('root'))
