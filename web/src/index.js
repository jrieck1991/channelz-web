import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Server extends React.Component {
    render() {
        return <h1>Hello World</h1>;
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

ReactDOM.render(
    <Server />,
    document.getElementById('root')
);