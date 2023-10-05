import React, { useState } from 'react';
import './Delete.css';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';


async function DeleteResources(credentials) {
    let token = JSON.parse(sessionStorage.getItem('token'));
    console.log("TOKEN ", token)
    return fetch('http://localhost:4000/channels/mychannel/chaincodes/basic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Delete() {
    const [userid, setUserId] = useState();
    const [docid, setDocId] = useState();
    const [aadharno, setAadharNo] = useState();

    async function handleSubmit(e) {
        e.preventDefault();
        let orgname = JSON.parse(sessionStorage.getItem('loggedorgname'));
        console.log("orgname", orgname);
        console.log("aadharno", aadharno);
        const res = await DeleteResources({
            "fcn": "delete",
            "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
            "chaincodeName": "basic",
            "channelName": "mychannel",
            "args": [orgname, userid, docid]
        });
        console.log(res['result'])
        ReactDOM.render(
            <div className="App">
                {res['result']['message']}
            </div>,
            document.getElementById('response')
        );

    }

    return (
        <div className="login-wrapper">
            <h2>Inside Delete function</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>
                        <span>AADHAR NO&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setAadharNo(e.target.value)} />
                    </p>
                </label>
                <label>
                    <p>
                        <span>USER ID&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setUserId(e.target.value)} />
                    </p>
                </label>
                <label>
                    <p>
                        <span>DOC ID&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setDocId(e.target.value)} />
                    </p>
                </label>
                <div><h1> </h1></div>
                <div>
                    <button type="submit" >Submit</button>
                </div>
            </form>
            <br />
            <br />
            <div id="response"></div>
        </div>
    )
}

render(<Delete />, document.getElementById('root'));

