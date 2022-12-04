
// import "../css/main.css";
import "../css/util.css";
import "../css/main.css";
import "../css/dashboard.css";


import { Connect, SimpleSigner, MNID } from 'uport-connect'
// import { default as contract } from 'truffle-contract'
import reporter_artifacts from '../../build/contracts/Reporter.json'
var ABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "admin",
          "type": "bytes32"
        },
        {
          "name": "complaint",
          "type": "bytes32"
        },
        {
          "name": "contact_info",
          "type": "bytes32"
        },
        {
          "name": "tags",
          "type": "bytes32"
        },
        {
          "name": "documents",
          "type": "bytes32"
        },
        {
          "name": "location",
          "type": "bytes32"
        },
        {
          "name": "date_of_crime",
          "type": "bytes32"
        },
        {
          "name": "visibility",
          "type": "uint256"
        },
        {
          "name": "type_of_complaint",
          "type": "uint256"
        }
      ],
      "name": "registerComplaints",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAllComplaints1",
      "outputs": [
        {
          "name": "",
          "type": "uint256[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAllComplaints2",
      "outputs": [
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "uint256[]"
        },
        {
          "name": "",
          "type": "uint256[]"
        },
        {
          "name": "",
          "type": "bytes32[]"
        },
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "police_station",
          "type": "bytes32"
        },
        {
          "name": "complaint_id",
          "type": "uint256"
        }
      ],
      "name": "acceptComplaint",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "complaint_id",
          "type": "uint256"
        },
        {
          "name": "proposed_solution",
          "type": "bytes32"
        }
      ],
      "name": "proposeSolution",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "complaint_id",
          "type": "uint256"
        },
        {
          "name": "police_station",
          "type": "bytes32"
        }
      ],
      "name": "acceptSolution",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "complaint_id",
          "type": "uint256"
        },
        {
          "name": "user_address",
          "type": "bytes32"
        },
        {
          "name": "stake",
          "type": "uint256"
        },
        {
          "name": "opinion",
          "type": "uint256"
        }
      ],
      "name": "addStake",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "complaint_id",
          "type": "uint256"
        }
      ],
      "name": "returnStakeValue",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "complaint_id",
          "type": "uint256"
        },
        {
          "name": "result",
          "type": "uint256"
        }
      ],
      "name": "distributeFunds",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    }
];





// var Reporter = contract(reporter_artifacts);

const uport = new Connect('Tushalien \'s new app', {
  clientId: '2otuaQSRzeDaUTBSYScEUctSnjFL2KwSFiH',
  network: 'rinkeby',
  signer: SimpleSigner('d41df28a2404ae1ccafed0f032b495c8d38371567ff003cea859035b8b2b2c7a')
})


const web3 = uport.getWeb3();
const reporterContract = web3.eth.contract(ABI);
const reporterInstance = reporterContract.at('0x638ac3745de423e774801a26c6f0e37848a5cdb8')


var decodedId, specificNetworkAddress

// Request credentials to login
window.loginUport = function(){
  uport.requestCredentials({requested: ['name', 'avatar', 'phone', 'country'], notifications: true})
  .then((userProfile) => {
    // Do something
    console.log("Recieved credentials", userProfile);
    decodedId = MNID.decode(userProfile.address)
    specificNetworkAddress = decodedId.address
    console.log(decodedId, specificNetworkAddress);
    sessvars.userProfile = userProfile;
    sessvars.decodedId = decodedId;
    sessvars.specificNetworkAddress = specificNetworkAddress;
    // uport.attestCredentials({
    //   sub: decodedId,
    //   claim: { 'Adhaar number': 'BBCPC0240C'},
    // }).then(function(res){
    //   console.log(res);
    // }).catch(function(err){
    //   console.log(err);
    // })
    window.location = "/dashboard.html";
  }) 
}



window.registerComplaint = function(form) {

  const reader = new FileReader();
  reader.onloadend = function() {
    const ipfs = window.IpfsApi('159.65.144.151', 5001) // Connect to IPFS
    const buf = buffer.Buffer(reader.result) // Convert data into buffer
    ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
      if(err) {
        console.error(err)
        return
      }
      let url = `https://ipfs.io/ipfs/${result[0].hash}`
      console.log(result[0].hash);
      let documents = result[0].hash;
      console.log("Inside register Complaint");
      let complaint = $('#complaint').val();
      let contact_info = $('#contact_info').val();
      let crime_date = $("#crime_date").val();
      let type_of_complaint = $("#type_of_complaint").val();
      let complaint_visibility = $('#complaint_visibility').val() === 'on'?1:0;
      let time_of_crime = $('#time_of_crime').val();
      let admin = decodedId;
      let tags = '';
      let location = '';
      console.log(documents);
      //console.log(complaint, contact_info, crime_date, type_of_complaint, complaint_visibility, documents, time_of_crime);
      return false;
      // reporterInstance.register_complaint(type, visibility, admin, title, (error, txHash) => {
      //   if (error) { throw error }
      //      waitForMined(txHash, { blockNumber: null }, // see next area
      //   function pendingCB () {
      //     // Signal to the user you're still waiting
      //     console.log("MIning");
      //     // for a block confirmation
      //   },
      //   function successCB (data) {
      //     // Great Success!
      //     console.log("Registered");
      //     // Likely you'll call some eventPublisherMethod(txHash, data)
      //   })
        
      // })
      
    })
  }
  const photo = document.getElementById("documents");
  reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

}
