import React, { useState } from 'react';
import './RequestPrivateData.css';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';
import FirebaseService from "../../services/firebase_service";

async function queryResources(credentials) {

    let token = JSON.parse(sessionStorage.getItem('token'));
    return fetch(`http://localhost:4000/channels/mychannel/chaincodes/basic?fcn=readPrivateDetails&args=${credentials['args']}&peers=["peer0.org1.example.com","peer0.org2.example.com"]`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(data => data.json())
}
export default function RequestPrivateData() {
    const [docid, setDocId] = useState()
    const [rollname, setRollName] = useState();
    const [orgname, setOrgName] = useState();
    const [aadharno, setAadharNo] = useState()
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(orgname)
        let orgnameloggedin = JSON.parse(sessionStorage.getItem('loggedorgname'))
        console.log(orgnameloggedin)
        
        var docname=orgnameloggedin+"_"+rollname+"_"+docid;
        var boolPerm = await  FirebaseService.getPermission(aadharno,docname,orgname);
        console.log("value at request file ",boolPerm.val());

        if(boolPerm.val()){
            const res = await queryResources({
                "fcn": "readPrivateDetails",
                "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
                "args": `["${orgnameloggedin}", "${rollname}", "${docid}"]`
            });
            console.log(res)
            if (!res['result']['cert']) {
                const element = "\n\nID DOES NOT EXIST";
                ReactDOM.render(element, document.getElementById('response'));
                return;
    
            }
            ReactDOM.render(
                <div className="App">
                    CERTIFICATE : {res['result']['cert']}
                    <br />
                    ID : {res['result']['id']}
                    <br />
    
                </div>,
                document.getElementById('response')
            );
        }
        else{
            const element = "\n\nID DOES NOT EXIST";
            ReactDOM.render(element, document.getElementById('response'));
            return;

        }
        
    }

    return (
        <div className="login-wrapper">
            <h2>Inside RequestPrivateData function</h2>
            <form onSubmit={handleSubmit}>
            <label>
                    <p>
                        <span>Aadhar No&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setAadharNo(e.target.value)} />
                    </p>
                </label>
                <label>
                    <p>
                        <span>Requesting Org Name&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setOrgName(e.target.value)} />
                    </p>
                </label>
                <label>
                    <p>
                        <span>USER ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <input type="text" onChange={e => setRollName(e.target.value)} />
                    </p>
                </label>
                <label>
                    <p>
                        <span>DOC ID&nbsp;&nbsp;&nbsp;</span>
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

render(<RequestPrivateData />, document.getElementById('root'));

