import React, { useState } from 'react';
import './Verify.css';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';
import { JSHash, CONSTANTS } from "react-native-hash";


async function addResources(credentials) {
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

export default function Verify() {
    const [userid, setUserId] = useState();
    const [docid, setDocId] = useState();
    const [aadharno, setAadharNo] = useState();
    const [orgname,setOrgName] = useState();
    const [hash,setHash] = useState();
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(aadharno)
        const res = await addResources({
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
        if (hash === res['result']['result']['hash']) {
            ReactDOM.render(
                <div className="App">
                    Document Verification Successful : {res['result']['result']['id']}
                    <br />
                </div>,
                document.getElementById('response')
            );
        }
        else {
            ReactDOM.render(
                <div className="App">
                    Document Verification Failed
                </div>,
                document.getElementById('response')
            );
        }

    }

    async function getHash(e) {

        // const input = document.getElementById('file_input')
        const reader = new FileReader();
        const fileByteArray = [];

        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = (evt) => {
            if (evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result,
                    array = new Uint8Array(arrayBuffer);
                for (const a of array) {
                    fileByteArray.push(a);
                }
                console.log(fileByteArray.toString());

                JSHash(fileByteArray.toString(), CONSTANTS.HashAlgorithms.sha256)
                    .then(hash => setHash(hash), console.log(hash))
                    .catch(e => console.log(e));

            }
        }

    }
    return (
        <div className="login-wrapper">
            <h2>Inside Verification function</h2>
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
                <label>
                    <p>
                        <span>HASH&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="file" id="file_input" accept="image/png, image/jpeg,application/pdf" onChange={getHash} />
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
        </div >
    )
}

render(<Verify />, document.getElementById('root'));

