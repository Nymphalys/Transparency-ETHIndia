//SPDX-license-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Reporter {

	struct Stake {
		address payable user_address;
		uint stake;
		uint opinion; //1->genuine FIR, 0->fake FIR
	}

    struct Complaint {
        uint id;
        bytes32 admin; //uportId of person registering complaint.
        bytes32 complaint;
        bytes32 contact_info;
        bytes32 tags;
        bytes32 proposed_solution;
        bytes32 documents;
        uint status;//0-> pending/open 1-> in process 2->closed/resolved
        uint upvotes;
        bytes32 location;//In the form of longitude latitude
        bytes32 date_of_crime;
        uint visibility;//0 -> closed 1-> open
        uint type_of_complaint;// 0-> criminal cases eg(Theft) 1->civil cases( Consumer court )2->enforcement( debt issue )
        // uint256 time;
    }


	//Mapping of uportid to an integer array of complaint ids
	mapping(bytes32 => uint[]) my_complaints;

	//Array of all_complaints
	Complaint[] all_complaints;

	//Mapping of uportid to and integer array of complaint ids
	mapping(bytes32 => uint[]) my_solved_complaints;

	mapping(uint => Stake[]) stakes_on_complaint;

	function registerComplaints(bytes32 admin, bytes32 complaint, bytes32 contact_info, bytes32 tags, bytes32 documents, bytes32 location, bytes32 date_of_crime, uint visibility, uint type_of_complaint ) public payable {
		Complaint memory newcomplaint;
		newcomplaint.id = all_complaints.length + 1;
        newcomplaint.admin = admin;
        newcomplaint.complaint = complaint;
        newcomplaint.contact_info = contact_info;
        newcomplaint.tags = tags;
        newcomplaint.documents = documents;
        newcomplaint.location = location;
        newcomplaint.date_of_crime = date_of_crime;
        newcomplaint.visibility = visibility;
        newcomplaint.type_of_complaint = type_of_complaint;
        newcomplaint.proposed_solution = '';
        newcomplaint.status = 0;//pending;
        newcomplaint.upvotes = 0;
	} 

    function getAllComplaints1() public returns (uint[] memory, bytes32[] memory, bytes32[] memory,bytes32[] memory,bytes32[] memory,bytes32[] memory){
        
        uint[] memory id = new uint[](all_complaints.length);
        bytes32[] memory admin = new bytes32[](all_complaints.length);
        bytes32[] memory complaint = new bytes32[](all_complaints.length);
        bytes32[] memory contact_info = new bytes32[](all_complaints.length);
        bytes32[] memory tags = new bytes32[](all_complaints.length);
        bytes32[] memory documents = new bytes32[](all_complaints.length);

        for(uint i=0;i<all_complaints.length;i++){
            Complaint storage c = all_complaints[i];
            id[i] = c.id;
            admin[i] = c.admin;
            complaint[i] = c.complaint;
            contact_info[i] = c.contact_info;
            tags[i] = c.tags;
            documents[i] = c.documents;

        }

        return(id, admin, complaint, contact_info, tags, documents);
    }
    function getAllComplaints2() public  returns (bytes32[] memory,bytes32[] memory, uint[] memory, uint[] memory, bytes32[] memory, uint[] memory){
        
        bytes32[] memory location = new bytes32[](all_complaints.length);
        bytes32[] memory date_of_crime = new bytes32[](all_complaints.length);
        uint[] memory visibility = new uint[](all_complaints.length);
        uint[] memory type_of_complaint = new uint[](all_complaints.length);
        bytes32[] memory proposed_solution = new bytes32[](all_complaints.length);
        uint[] memory status = new uint[](all_complaints.length);

        for(uint i=0;i<all_complaints.length;i++){
            Complaint storage c = all_complaints[i];

            location[i] = c.location;
            date_of_crime[i] = c.date_of_crime;
            visibility[i] = c.visibility;
            type_of_complaint[i] = c.type_of_complaint;
            proposed_solution[i] = c.proposed_solution;
            status[i] = c.status;
        }

        return(location, date_of_crime, visibility, type_of_complaint, proposed_solution, status);
    }
	function acceptComplaint(bytes32 police_station, uint complaint_id) public payable{
		my_complaints[police_station].push(complaint_id);
		all_complaints[complaint_id].status = 1; //in progress
	}

	function proposeSolution(uint complaint_id, bytes32 proposed_solution) public payable{
		all_complaints[complaint_id].proposed_solution = proposed_solution;
	}

	function acceptSolution(uint complaint_id, bytes32 police_station) public  payable{
		all_complaints[complaint_id].status = 2;// closed;
		my_solved_complaints[police_station].push(complaint_id);
		distributeFunds(complaint_id, 1);//it was a genuine problem
	}

	function addStake(uint complaint_id, address payable _user_address, uint stake, uint opinion) public payable {
		Stake memory newstake;
		newstake.user_address = _user_address;
		newstake.stake = stake;
		newstake.opinion = opinion;
		stakes_on_complaint[complaint_id].push(newstake);
	}

	function returnStakeValue(uint complaint_id) public returns(uint){
		uint total=0;
		for(uint i=0;i< stakes_on_complaint[complaint_id].length;i++){
			total += stakes_on_complaint[complaint_id][i].stake;
		}
		return total;
	}

	function distributeFunds(uint complaint_id, uint result) public payable {
		uint total_return_amount=0;
		uint wrong_opinion_count=0;
		for(uint i=0;i<stakes_on_complaint[complaint_id].length;i++){
			if(stakes_on_complaint[complaint_id][i].opinion != result){
				total_return_amount += stakes_on_complaint[complaint_id][i].stake;
				wrong_opinion_count++;
			}
		}
		uint extra_return = total_return_amount/(stakes_on_complaint[complaint_id].length+wrong_opinion_count);
		for(uint i=0;i<stakes_on_complaint[complaint_id].length;i++){
			if(stakes_on_complaint[complaint_id][i].opinion != result)
				continue;
			uint amount = stakes_on_complaint[complaint_id][i].stake + extra_return;
			address payable to_address;
            to_address = stakes_on_complaint[complaint_id][i].user_address;
			to_address.transfer(amount);			
		}
	}
}