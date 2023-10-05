import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import App from '../App/App';
import './Login.css';
import { render } from 'react-dom';
// import { Link } from 'react-router-dom';
// import { alert } from "react-alert";

async function loginUser(credentials) {
    return fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}


async function registerUser(credentials) {
    return fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Login() {
    const [username, setUserName] = useState();
    const [orgname, setOrgName] = useState();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username && !orgname) {
            alert("Kindly enter user details");
            return;
        }
        const body = await loginUser({
            "username": username,
            "orgName": orgname
        });
        console.log(body['success']);
        if (!body['success']) {
            console.log("!!Error!!");
            alert("Incorrect Login Details");
            window.location.assign("http://localhost:3000");
            return;
        }
        console.log(body['message']);
        let token = body['message']['token'];

        console.log(token);
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('loggedorgname', JSON.stringify(orgname));

        window.location.assign("http://localhost:3000");

    }
    async function handleRegister(e) {
        if (!username && !orgname) {
            alert("Kindly enter user details");
            return;
        }
        const body = await registerUser({
            "username": username,
            "orgName": orgname
        });
        console.log(body['success']);
        alert("User Registered Successfully");
        // sessionStorage.removeItem('token');
        window.location.assign("http://localhost:3000");
    }

    return (
        <div className="login-wrapper">
            <h1>Login/Register</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>OrgName</p>
                    <input type="text" onChange={e => setOrgName(e.target.value)} />
                </label>
                <div><h1> </h1></div>
                <div>
                    <button type="submit" >SignIn</button>
                    <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <button type="button" onClick={handleRegister}>Register</button>
                </div>
            </form>

        </div >
    )
}

render(<Login />, document.getElementById('root'));


