import React from 'react';
import ReactDOM from 'react-dom';
import getweb3 from './getWeb3';
import ElevatorContract from './contracts/Elevator.json';
import './index.css';

class Contract extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            called_to_floor: 0,
            current_floor: 0,
            people_in_lift: 0,
            door_opened: "Door closed",
            people_going_in: 0,
            people_coming_out: 0,
            is_moving: "Lift is not Moving",
            desired_direction: "",
            buffer: 0,
            inner: 0,
            web3: null,
            account: null,
            contract: null,
        };
    }

    componentDidMount = async () => {
        try {

            const web3 = await getweb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = ElevatorContract.networks[networkId];
            const instance = new web3.eth.Contract(
                ElevatorContract.abi,
                deployedNetwork && deployedNetwork.address
            );

            this.setState({
                web3: web3,
                accounts: accounts,
                contract: instance
            });
        }
        catch (error) {
            alert('Failed to load web3');
            console.log(error);
        }
    }

    handleChange = async (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleClickPeople = async (event) => {
        console.log("Inside Func");
        if (this.state.door_opened === "Door Opened") {
            const contract = this.state.contract;
            await contract.methods.people(this.state.people_going_in, this.state.people_coming_out).send({
                from: this.state.accounts[0]
            });
            this.setState({
                people_in_lift: await contract.methods.people_in_lift().call()
            });
        }
    }

    handleClickUp = async (event) => {
        const contract = this.state.contract;
        await contract.methods.liftCalled(this.state.called_to_floor).send({
            from: this.state.accounts[0]
        });

        this.setState({
            is_moving: "Lift is moving up",
            door_opened: "Door Closed",
            desired_direction: "Up"
        })
        setInterval(async () => {
            const dest = await contract.methods.current_position().call();
            if (dest > this.state.current_floor) {
                this.setState({
                    current_floor: this.state.current_floor + 1,
                    is_moving: "Lift is moving up",
                    door_opened: "Door closed"
                })
            } else if (dest < this.state.current_floor) {
                this.setState({
                    current_floor: this.state.current_floor - 1,
                    is_moving: "Lift is moving up",
                    door_opened: "Door closed"
                })
            } else {
                this.setState({
                    current_floor: this.state.current_floor,
                    is_moving: "Lift is not moving",
                    door_opened: "Door Opened",
                })
                return;
            }
        }, 7000);
    }

    handleClickDown = async (event) => {
        const contract = this.state.contract;
        await contract.methods.liftCalled(this.state.called_to_floor).send({
            from: this.state.accounts[0]
        });
        this.setState({
            is_moving: "Lift is moving down",
            door_opened: "Door Closed",
            desired_direction: "Down",
            buffer: this.state.called_to_floor
        })
        setInterval(async () => {
            const dest = await contract.methods.current_position().call();
            if (dest > this.state.current_floor) {
                this.setState({
                    current_floor: this.state.current_floor + 1,
                    is_moving: "Lift is moving up",
                    door_opened: "Door closed"
                })
            } else if (dest < this.state.current_floor) {
                this.setState({
                    current_floor: this.state.current_floor - 1,
                    is_moving: "Lift is moving down",
                    door_opened: "Door closed"
                })
            } else {
                this.setState({
                    current_floor: this.state.current_floor,
                    is_moving: "Lift is not moving",
                    door_opened: "Door Opened",
                })
                return;
            }
        }, 7000);
    }

    innerButtons = async(event) =>{
        const contract = this.state.contract;
        const value = event.target.value;
        console.log(value)
        await contract.methods.liftCalled(value).send({
            from: this.state.accounts[0]
        });
        this.setState({
            is_moving: "Lift is moving up",
            door_opened: "Door Closed"
        })
        setInterval(async () => {
            const dest = await contract.methods.current_position().call();
            if (dest > this.state.current_floor) {
                this.setState({
                    current_floor: this.state.current_floor + 1,
                    is_moving: "Lift is moving up",
                    door_opened: "Door closed"
                })
            } else if (dest < this.state.current_floor) {
                this.setState({
                    current_floor: this.state.current_floor - 1,
                    is_moving: "Lift is moving down",
                    door_opened: "Door closed"
                })
            } else {
                this.setState({
                    current_floor: this.state.current_floor,
                    is_moving: "Lift is not moving",
                    door_opened: "Door Opened",
                })
                return;
            }
        }, 7000);
    }
    render() {
        return (
            <div>
                <div className="split left">
                    <h1>Elevator Management System</h1>
                    <div className="centered">
                        <h1>External Calling Panel</h1>
                        <label htmlFor="floor"><b>Floor no.</b></label>
                        <input type="number" id="called_to_floor" name="called_to_floor" value={this.state.called_to_floor} onChange={this.handleChange}></input>
                        <button id="button" onClick={this.handleClickUp}>Up</button>
                        <button id="button" onClick={this.handleClickDown}>Down</button>
                        <label htmlFor="people_going_in"><b>No. of people entering Lift</b></label>
                        <input type="number" id="people_going_in" name="people_going_in" value={this.state.people_going_in} onChange={this.handleChange}></input>
                        <button id="button" onClick={this.handleClickPeople}>Enter People</button>
                    </div>
                </div>

                <div className="split right">
                    <div id="display">
                        <h2>Current Floor : {this.state.current_floor}</h2>
                        <h2>No. of People in lift : {this.state.people_in_lift}</h2>
                        <h2>{this.state.is_moving}</h2>
                        <h2>{this.state.door_opened}</h2>
                    </div>
                    <div className="centered">
                        <h1>Internal Control Panel</h1>
                        <label htmlFor="people_coming_out" name="people_coming_out"><b>No. of People coming out</b></label>
                        <input type="number" id="people_coming_out" name="people_coming_out" value={this.state.people_coming_out} onChange={this.handleChange}></input>
                        <button id="button" onClick={this.handleClickPeople}>Exit People</button>
                        <button id="innerButton" onClick={this.innerButtons} value={0}>0</button><br></br>
                        <button id="innerButton" onClick={this.innerButtons} value={1}>1</button>
                        <button id="innerButton" onClick={this.innerButtons} value={2}>2</button><br></br>
                        <button id="innerButton" onClick={this.innerButtons} value={3}>3</button>
                        <button id="innerButton" onClick={this.innerButtons} value={4}>4</button><br></br>
                        <button id="innerButton" onClick={this.innerButtons} value={5}>5</button>
                        <button id="innerButton" onClick={this.innerButtons} value={6}>6</button><br></br>
                        <button id="innerButton" onClick={this.innerButtons} value={7}>7</button>
                        <button id="innerButton" onClick={this.innerButtons} value={8}>8</button><br></br>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Contract></Contract>,
    document.getElementById('root')
);