import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';

class Donate extends Component {
    constructor(props) {
        super(props)
        this.state={donationRequests:[], myDonations:[]}
        const {user} = this.props.auth0;
        this.account = null;
        fetch(process.env.REACT_APP_API + 'auth', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authToken: user.sub
            })
        })
        .then(result => result.json())
        .then((result) => {
            this.account = result;
            console.log(this.account);
        });
        setTimeout(() => this.refreshList(), 200);
    }

    refreshList(){
        fetch(process.env.REACT_APP_API + 'donate')
        .then(response => response.json())
        .then(data => {
            this.setState({donationRequests:data})
        });
        if(this.account != null)
        {
            fetch(process.env.REACT_APP_API + 'userdonations/' + this.account[0].userId)
            .then(response => response.json())
            .then(data => {
                this.setState({myDonations:data})
            });
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    componentDidUpdate() {
        this.refreshList();
    }

    render() {

        const {donationRequests}=this.state;
        const {myDonations}=this.state;
        return (
            <div className='donation_requests2'>
                <div>
                    <h2>DONATION REQUESTS</h2>
                    <Table className="mt-4" striped border hover size="sm">
                            <tr>
                                <th>Donation request id</th>
                                <th>Resource type</th>
                                <th>Quantity gathered</th>
                                <th>Options</th>
                            </tr>
                        <tbody>
                            {
                                donationRequests.map(dr =>
                                    <tr>
                                        <td>{dr.donationRequestId}</td>
                                        <td>{dr.resourceType}</td>
                                        <td>{dr.quantityGathered} / {dr.quantityNeeded}</td>
                                        <td>
                                        <Button className="mr-2" variant="info" size="sm" onClick={() =><Link to={'/user_view_donation_request/' + dr.donationRequestId}></Link> }>
                                        <Link to={'/user_view_donation_request/' + dr.donationRequestId}>View details</Link>
                                        </Button>
                                        </td>
                                    </tr>
                                    )
                            }
                        </tbody>
                    </Table>

                   <h2>MY DONATIONS</h2>

                   <Table className="mt-4" striped border hover size="sm">
                            <tr>
                                <th>Donation ID</th>
                                <th>Resource type</th>
                                <th>Quantity donated</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        <tbody>
                            {
                                myDonations.map(donation =>
                                    <tr>
                                        <td>{donation.donationId}</td>
                                        <td>{donation.resourceType}</td>
                                        <td>{donation.quantityDonated}</td>
                                        <td>{donation.emissionDate}</td>
                                        <td>{donation.donationStatus}</td>
                                    </tr>
                                    )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default withAuth0(Donate);
