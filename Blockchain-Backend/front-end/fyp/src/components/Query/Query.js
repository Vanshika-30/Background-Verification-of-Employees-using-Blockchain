import React, { useState } from 'react';
import './Query.css';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';


async function queryResources(credentials) {

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

export default function Query() {
    const [userid, setUserId] = useState();
    const [docid, setDocId] = useState();
    const [aadharno, setAadharNo] = useState();
    const [orgname,setOrgName] = useState();
    async function handleSubmit(e) {
        e.preventDefault();
        // let orgname = JSON.parse(sessionStorage.getItem('loggedorgname'));
        // console.log("orgname", orgname);
        console.log("aadharno", aadharno);
        const res = await queryResources({
            "fcn": "query",
            "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
            "chaincodeName": "basic",
            "channelName": "mychannel",
            "args": [orgname, userid, docid]
        });
        if (!res['result']['message']) {
            const element = "\n\nID DOES NOT EXIST";
            ReactDOM.render(element, document.getElementById('response'));
            return;

        }
        console.log(res['result'])
        // const element = <p></p>{ res['result']['message'] }  <br /> $res['result']['result']['id'] < br /> $res['result']['result']['hash']</p >;
        // ReactDOM.render(element, document.getElementById('response'));
        ReactDOM.render(
            <div className="App">
                {res['result']['message']}
                <br />
                ID : {res['result']['result']['id']}
                <br />
                HASH : {res['result']['result']['hash']}
            </div>,
            document.getElementById('response')
        );
    }

    return (
        <div className="login-wrapper">
            <h2>Inside Query function</h2>
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

render(<Query />, document.getElementById('root'));

