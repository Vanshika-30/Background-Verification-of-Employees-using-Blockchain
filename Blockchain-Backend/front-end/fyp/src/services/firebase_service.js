// import firebase from "../firebase";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from 'firebase/app';
// import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    
        apiKey: "AIzaSyCfcGpA4_9pJ5ls35ozIuupj3t3UpA-dfE",
        authDomain: "final-year-project-b8303.firebaseapp.com",
        databaseURL: "https://final-year-project-b8303-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "final-year-project-b8303",
        storageBucket: "final-year-project-b8303.appspot.com",
        messagingSenderId: "1082358269382",
        appId: "1:1082358269382:web:361d027b51349902399ec7"
  //...
};

initializeApp(firebaseConfig);

// const dbRef = ref(getDatabase());
class FirebaseService {
    async getPermission(aadhar, docid, orgid){
        var retval= await get(child(ref(getDatabase()), aadhar + "/"+orgid+"/"+docid));
        console.log("retval: "+retval);
        return retval;
    }
    setPermission(aadhar, docid,issuedorg){
        var orgs=["Org1","Org2"];
        for (var org of orgs){
            console.log(aadhar + "/"+org+"/"+docid)
            if(org===issuedorg)
            {
                    set(ref(getDatabase(), aadhar + "/"+org+"/"+docid), true);
            }
            else
            {
                set(ref(getDatabase(), aadhar + "/"+org+"/"+docid), false);
            }    
        }
    }
}
export default new FirebaseService();