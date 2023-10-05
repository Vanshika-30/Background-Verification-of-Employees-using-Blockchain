/*
Copyright IBM Corp. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

package simple

import (
	"fmt"
	"os"
	"strings"
	"strconv"
	"encoding/json"
	
	"github.com/hyperledger/fabric-chaincode-go/shim"
	pb "github.com/hyperledger/fabric-protos-go/peer"
)

// WorkEx example simple Chaincode implementation
type WorkEx struct{}
type OrgAsset struct {
	Id   string `json:"id"`
	Hash string `json:"hash"`
}
type OrgPrivateAsset struct {
	Id   string `json:"id"`
	Cert string `json:"cert"`
}

func checkInput(id string, rn string, docid string ) bool {
	if(strings.Contains(id,"_") || strings.Contains(rn,"_") || strings.Contains(docid,"_")) {
		return false
	}else {
		return true
	}
}

func checkAadhar(aadharNumber string) bool {
	_, err := strconv.Atoi(aadharNumber)
    if err != nil {
        fmt.Printf("Supplied value %s is not a number\n", aadharNumber)
		return false
    }
	length := len(aadharNumber)
	if(length!=12){
		return false
	}
	return true
}

func (t *WorkEx) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("Init invoked")
	assetData := OrgAsset{
		Id:   "VNIT_BT18CSE001_demodoc",
		Hash: "demodochash",
	}
	assetBytes, _ := json.Marshal(assetData)
	assetErr := stub.PutState("VNIT_BT18CSE001_demodoc", assetBytes)
	if assetErr != nil {
		return shim.Error(fmt.Sprintf("Failed to create asset:"))
	}

	return shim.Success(nil)
}

func (t *WorkEx) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Fprintf(os.Stderr,"Invoke invoked")
	if os.Getenv("DEVMODE_ENABLED") != "" {
		fmt.Println("invoking in devmode")
	}
	function, args := stub.GetFunctionAndParameters()

	// Security check
	// if(checkInput(args[0],args[1],args[2])==false){
	// 	return shim.Error(`Invalid arguments passed!`)
	// }

	switch function {
	case "init":
		// Make payment of X units from A to B
		return t.Init(stub)
	case "invoke":
		// Make payment of X units from A to B
		return t.invoke(stub, args)
	case "delete":
		// Deletes an entity from its state
		return t.delete(stub, args)
	case "query":
		// the old "Query" is now implemented in invoke
		return t.query(stub, args)
	case "history":
		return t.getHistory(stub, args)
	case "update":
		// return with an error
		return t.updateState(stub, args)
	case "addChr":
		return t.addCharacterCert(stub, args)
	case "createPrivateCert":
		return t.createPrivateCert(stub, args)
	case "readPrivateDetails":
		return t.readPrivateDetails(stub,args)
	default:
		return shim.Error(`Invalid invoke function name. Expecting "invoke", "delete", "query", "respond", "mspid", or "event"`)
	}
}


// Transaction makes payment of X units from A to B
func (t *WorkEx) invoke(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("invoke called")
	var id, hash string // Entities
	var rn,docid string
	
	// college id, roll no, doc id, hash 
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	if(checkInput(args[0],args[1],args[2])==false){
		return shim.Error(`Invalid arguments passed!`)
	}
	if(args[4]!=args[0]){
		return shim.Error(`Access from wrong organisation`)
	}
	id = args[0]
	rn = args[1]
	docid = args[2]
	hash = args[3]
	assetData := OrgAsset{
		Id:   id+"_"+rn+"_"+docid,
		// strings.Join(args[0:2], "_")
		Hash: hash,
	}

	// Add checks for org and other params
	fmt.Printf(assetData.Id)
	fmt.Printf("MYYYYYYYYY")
	fmt.Printf(id+"_"+rn+"_"+docid)
	assetBytes, _ := json.Marshal(assetData)
	var err error
	err = stub.PutState(assetData.Id, assetBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(assetBytes)
}

// Transaction makes payment of X units from A to B
func (t *WorkEx) addCharacterCert(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("add chracter certificate called")
	var id, hash string // Entities
	var rn,docid string
	var aadharNumber string

	// college id, roll no, doc id,hash, aadharcard 
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	if(checkInput(args[0],args[1],args[2])==false){
		return shim.Error(`Invalid arguments passed!`)
	}
	id = args[0]
	rn = args[1]
	docid = args[2]
	hash = args[3]
	aadharNumber = args[4]
	assetData := OrgAsset{
		Id:   id+"_"+rn+"_"+docid,
		// strings.Join(args[0:2], "_")
		Hash: hash,
	}
	if(checkAadhar(aadharNumber)==false){
		return shim.Error(`Invalid Aadhar Number`)
	}
	assetBytes, _ := json.Marshal(assetData)
	var err error
	err = stub.PutState(assetData.Id, assetBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	assetData2 := OrgAsset{
		Id:   aadharNumber+"_CHR",
		Hash: assetData.Id,
	}
	assetBytes2, _ := json.Marshal(assetData2)
	err = stub.PutState(assetData2.Id, assetBytes2)
	if err != nil {
		return shim.Error(err.Error())
	}


	return shim.Success(assetBytes2)
}
// Update Existing Chaincode
func (t *WorkEx) updateState(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("update called")
	var id, hash string // Entities
	var rn,docid string

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	if(checkInput(args[0],args[1],args[2])==false){
		return shim.Error(`Invalid arguments passed!`)
	}
	if(args[4]!=args[0]){
		return shim.Error(`Access from wrong organisation`)
	}

	id = args[0]
	rn = args[1]
	docid = args[2]
	hash = args[3]
	assetData := OrgAsset{
		Id:   id+"_"+rn+"_"+docid,
		// strings.Join(args[0:2], "_")
		Hash: hash,
	}

	assetBytes, _ := json.Marshal(assetData)
	var err error

	Avalbytes, err := stub.GetState(assetData.Id)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to update state for " + assetData.Id + " as it does not exist\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + assetData.Id + "\"}"
		return shim.Error(jsonResp)
	}

	err = stub.PutState(assetData.Id, assetBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// Deletes an entity from state
func (t *WorkEx) delete(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("delete called")
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	if(checkInput(args[0],args[1],args[2])==false){
		return shim.Error(`Invalid arguments passed!`)
	}
	if(args[3]!=args[0]){
		return shim.Error(`Access from wrong organisation`)
	}
	// 10_11_12_13
	id := args[0]+"_"+args[1]+"_"+args[2]

	// Delete the key from the state in ledger
	err := stub.DelState(id)
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

// query callback representing the query of a chaincode
func (t *WorkEx) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("query called")
	var A string // Entities
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	A = args[0] 

	// Get the state from the ledger
	Avalbytes, err := stub.GetState(A)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + A + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + A + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := string(Avalbytes)
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}

// Get history of asset
//
// Shows Off GetHistoryForKey() - reading complete history of a key/value
//
// ============================================================================================================================
func (c *WorkEx) getHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("history called")
	type DocHistory struct {
		TxId  string   `json:"txId"`
		Value OrgAsset `json:"value"`
	}
	var history []DocHistory
	var orgAsset OrgAsset

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	assetId := args[0]
	fmt.Printf("- start getHistoryForAsset: %s\n", assetId)

	// Get History
	resultsIterator, err := stub.GetHistoryForKey(assetId)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		historyData, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		var tx DocHistory
		tx.TxId = historyData.TxId
		json.Unmarshal(historyData.Value, &orgAsset)
		tx.Value = orgAsset           //copy orgAsset over
		history = append(history, tx) //add this tx to the list
	}
	fmt.Printf("- getHistoryForAsset returning:\n%s", history)

	//change to array of bytes
	historyAsBytes, _ := json.Marshal(history) //convert to array of bytes
	return shim.Success(historyAsBytes)
}

func (s *WorkEx) createPrivateCert(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var id, cert string // Entities
	var rn,docid string
	if len(args) != 5 {
		return shim.Error("Incorrect arguments. Expecting 5 arguments")
	}
	if(args[0]!=args[1]){
		return shim.Error(`Access from wrong organisation`)
	}
	id = args[1]
	rn = args[2]
	docid = args[3]
	cert = args[4]
	assetData := OrgPrivateAsset{
		Id:   id+"_"+rn+"_"+docid,
		Cert: cert,
	}
	
	assetAsBytes, _ := json.Marshal(assetData)
	
	err := stub.PutPrivateData("PrivateDetails"+args[0], assetData.Id, assetAsBytes)
	if err != nil {
		return shim.Error("Failed to add asset: " + assetData.Id)
	}
	return shim.Success(assetAsBytes)
}


func (s *WorkEx) readPrivateDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	var id string // Entities
	var rn,docid string
	
	id = args[1]
	rn = args[2]
	docid = args[3]


	assetAsBytes, err := stub.GetPrivateData("PrivateDetails"+args[1], id+"_"+rn+"_"+docid)

	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get private details for " + id+"_"+rn+"_"+docid + ": " + err.Error() + "\"}"
		return shim.Error(jsonResp)
	} else if assetAsBytes == nil {
		jsonResp := "{\"Error\":\"Marble private details does not exist: " + id+"_"+rn+"_"+docid + "\"}"
		return shim.Error(jsonResp)
	}
	return shim.Success(assetAsBytes)
}
