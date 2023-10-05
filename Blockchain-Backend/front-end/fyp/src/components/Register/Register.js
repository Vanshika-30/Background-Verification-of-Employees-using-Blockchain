import React, { useState } from 'react';
import './Register.css';
import { render } from 'react-dom';


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

export default function Register() {
    const [username, setUserName] = useState();
    const [orgname, setOrgName] = useState();

    async function handleSubmit(e) {
        e.preventDefault();
        const body = await registerUser({
            "username": username,
            "orgName": orgname
        });
        console.log(body['success']);
        alert("User Registered Successfully");
        sessionStorage.removeItem('token');
        // window.location.assign("http://localhost:3000");

    }

    return (
        <div className="login-wrapper">
            <h1>Register</h1>

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
                    <button type="submit" >Submit</button>
                </div>
            </form>

        </div >
    )
}

render(<Register />, document.getElementById('root'));


