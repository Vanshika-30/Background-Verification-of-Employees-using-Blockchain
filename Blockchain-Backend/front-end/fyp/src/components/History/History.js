

import React, { useState } from 'react';
import './History.css';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';


async function HistoryResources(credentials) {
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

export default function History() {
    const [userid, setUserId] = useState();
    const [docid, setDocId] = useState();
    const [aadharno, setAadharNo] = useState();
    const [orgname,setOrgName] = useState();
    async function handleSubmit(e) {
        e.preventDefault();
        // let orgname = JSON.parse(sessionStorage.getItem('loggedorgname'));
        // console.log("orgname", orgname);
        console.log("aadharno", aadharno);
        const res = await HistoryResources({
            "fcn": "history",
            "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
            "chaincodeName": "basic",
            "channelName": "mychannel",
            "args": [orgname, userid, docid]
        });
        console.log(res['result'])
        if (!res['result']['result']) {
            const element = "\n\nHISTORY DOES NOT EXIST";
            ReactDOM.render(element, document.getElementById('response'));
            return;

        }
        ReactDOM.render(
            <div className="App">
                {res['result']['message']}
                <br />
                <table cellPadding="2" cellSpacing="2" border="2">
                    <thead><tr>
                        <th>Transaction ID</th>
                        <th>ID</th>
                        <th>Hash</th>

                    </tr>
                    </thead>
                    <tbody>
                    {res['result']['result'].map((value, index) => {
                        return <tr key={index}><td key={index}>{value['txId']}</td><td>{value['value']['id']}</td><td>{value['value']['hash']}</td></tr>
                    })}
                    </tbody>
                </table>
                < br />
                <br />
            </div >,
            document.getElementById('response')
        );

    }

    return (
        <div className="login-wrapper">
            <h2>Inside History function</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>
                        <span>AADHAR NO&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setAadharNo(e.target.value)} />
                    </p>
                </label>
                <label>
                    <p>
                        <span>Org Name&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setOrgName(e.target.value)} />
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

render(<History />, document.getElementById('root'));

