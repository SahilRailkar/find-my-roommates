import React from 'react'
import './Profile.css'
import Tag from '../components/Tag/Tag.js'

const Component = React.Component

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            gender: '',
            year: '',
            major: '',
            traits: ['Chef', 'Pet Lover', 'Photographer', 'Netflix Addict', 'Shopaholic'],
            about: '',
            location: '',
            moveIn: '',
            moveOut: '',
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
                <div id="name">Peter Anteater</div>
                <div id="tags"> {this.tags} </div>
            </div>
        )
    }
}

export default Profile;