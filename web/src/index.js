var React = require('react');
var ReactDOM = require('react-dom');

class Server extends React.Component {
    render() {
        return (
            <div>
                <h1>Server</h1>
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

$(document).ready(function () {
    $('div#root').remore();
    ReactDOM.render(<Server />, document.getElementById('root'))
})