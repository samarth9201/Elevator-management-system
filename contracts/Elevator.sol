pragma solidity >=0.4.0 < 0.7.0;

contract Elevator{
    int public capacity;
    int public current_position;
    int public people_in_lift;

    constructor() public{
        capacity = 8;
        current_position = 1;
        people_in_lift = 0;
    }
    modifier is_full(){
        require(people_in_lift <= 8 && people_in_lift >= 0, "Invalid no. of people_in_lift");
        _;
    }
    function update_position(int _update) public {
        current_position = current_position + _update;
    }
    function update_people_in_lift(int _update) public is_full{
        require(people_in_lift+_update <= 8 && people_in_lift + _update >= 0, "Invalid no. of people_in_lift 1");
        people_in_lift = people_in_lift + _update;
    }
    function liftCalled(int _calledFrom) public returns(int){

        int update_position_by = _calledFrom - current_position;
        update_position(update_position_by);
        require(current_position <= 8,"Invalid Floor");
        return (current_position);
    }

    function people(int _numberOfPeopleGoingInLift, int _numberOfPeopleComingOutOfLift) public returns(int){
        int update_capacity_by = _numberOfPeopleGoingInLift - _numberOfPeopleComingOutOfLift;
        update_people_in_lift(update_capacity_by);
        return people_in_lift;
    }
}