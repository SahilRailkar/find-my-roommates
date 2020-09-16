import React from 'react'
import './Profile.css'
import Tag from '../components/Tag/Tag.js'
import {Row, Col} from 'react-bootstrap'

const Component = React.Component

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            firstName: 'Peter',
            lastName: 'Anteater',
            gender: '',
            year: 'Senior',
            major: 'Computer Science and Engineering',
            traits: ['Chef', 'Pet Lover', 'Photographer', 'Netflix Addict', 'Shopaholic', 'Night Owl', 'Party Animal', 'Music Enthusiast'],
            about: 'Every year, on July 4th, the USA celebrates the birth of one Sahil Railkar, a 2nd Year Computer Science major who only texts in lowercase, with bald eagles, bbq, and fireworks. Sahil bless America!',
            location: 'Irvine',
            moveIn: '09/26/2021',
            moveOut: '06/14/2022',
            mixedGender: false
        }

        this.tags = this.state.traits.map(trait => <Tag text={trait} className="tag"/>)
    }

    render() {
        return (
            <div>
                <div id="wallpaper"></div>
                <div className="line">
                    <span id="profile"></span>
                </div>
                <Row>
                    <Col md={1} xl={3}></Col>
                    <Col md={10} xl={6} id="content">
                        <Row id="name-row">
                            <div id="name">{this.state.firstName + " " + this.state.lastName}</div>
                        </Row>
                        <Row>
                            <div> {this.tags} </div>
                        </Row>
                        <Row id="info">
                            <div>
                                <div className="sep"><strong>Year:</strong>{" " + this.state.year}</div>
                                <div className="sep"><strong>Major:</strong>{" " + this.state.major}</div>
                                <div className="sep"><strong>About:</strong>{" " + this.state.about}</div>
                            </div>
                        </Row>  
                        <Row id="preferences">
                            <div>
                                <div className="sep"><strong>Preferences:</strong></div>
                                <div className="sep"><strong>Location:</strong>{" " + this.state.location}</div>
                                <div className="sep"><strong>Move-in Date:</strong>{" " + this.state.moveIn}</div>
                                <div className="sep"><strong>Move-out Date:</strong>{" " + this.state.moveOut}</div>                                
                            </div>
                        </Row>
                    </Col>
                    <Col md={1} xl={3}></Col>
                </Row>

            </div>
        )
    }
}

export default Profile;