import React, { useState } from 'react';
import './QueryCHR.css';
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


async function getHashResource(credentials) {

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

export default function QueryCHR() {
    const [aadharno, setAadharNo] = useState();
    async function handleSubmit(e) {
        e.preventDefault();
        // let orgname = JSON.parse(sessionStorage.getItem('loggedorgname'));
        // console.log("orgname", orgname);
        console.log("aadharno", aadharno);
        const res = await queryResources({
            "fcn": "hChr",
            "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
            "chaincodeName": "basic",
            "channelName": "mychannel",
            "args": [aadharno]
        });
        if (!res['result']['result']) {
            const element = "\n\nID DOES NOT EXIST";
            ReactDOM.render(element, document.getElementById('response'));
            return;

        }
        var result=[]
        for(const item of res['result']['result'])
        {
            var parameters = item['value']['hash'].split("_");

            var hashval = await getHashResource({
                "fcn": "query",
                "peers": ["peer0.org1.example.com","peer0.org2.example.com"],
                "chaincodeName":"basic",
                "channelName": "mychannel",
                "args": [parameters[0],parameters[1],parameters[2]],
            });
            if (!hashval['result']['result']) {
                const element = "HASH DOES NOT EXIST";
                result.push(
                {
                    "ID":item['value']['id'],
                    "DOC ID":item['value']['hash'],
                    "HASH":element
                })
            }
            else{
                result.push(
                {
                    "ID":item['value']['id'],
                    "DOC ID":item['value']['hash'],
                    "HASH":hashval['result']['result']['hash']
                })
            }
            
        }
        
        
        console.log(res['result']);
        ReactDOM.render(
            <div className="App">
                {res['result']['message']}
                <br />
                <table cellPadding="2" cellSpacing="2" border="2">
                    <thead><tr>
                        <th>ID</th>
                        <th>DOC ID</th>
                        <th>Hash</th>

                    </tr>
                    </thead>
                    <tbody>
                    {result.map((value, index) => {
                        return <tr key={index}><td key={index}>{value['ID']}</td><td>{value['DOC ID']}</td><td>{value['HASH']}</td></tr>
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
            <h2>Inside QueryCHR function</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>
                        <span>AADHAR NO&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setAadharNo(e.target.value)} />
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

render(<QueryCHR />, document.getElementById('root'));

