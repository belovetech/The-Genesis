import React from 'react';

import FormInput from '../../components/form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import {auth, createUsersProfileDocument} from '../../firebase/firebase.utils';

import './sign-up.styles.scss';


class SignUp extends React.Component {
    constructor() {
        super() 
        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        const {displayName, email, password, confirmPassword} = this.state;

        if(password != confirmPassword) {
            alert("password don't match")
            return;
        }

        try {
            const user = await auth.createUserWithEmailAndPassword(email, password);

            await createUsersProfileDocument(user, {displayName});

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            })

        } catch (error){
            console.error(error);
        }
    };

    handleChange = (e) => {
        const {name, value} = e.target

        this.setState({ [name]: value })
    };

    render() {
        const {displayName, email, password, confirmPassword} = this.state;

        return (
            <div className="sign-up">
                    <h2>I don't have an account</h2>
                    <span>sign up with your email and password.</span>

                <form onSubmit={this.handleSubmit}>
                    <FormInput
                        name="displayName"
                        type="text"
                        value={displayName}
                        handleChange={this.handleChange}
                        label="Display name"
                        required
                    />
                    <FormInput 
                        name="email"
                        type="email"
                        value={email}
                        handleChange={this.handleChange}
                        label="Email"
                        required
                    />
                    <FormInput
                        name="password" 
                        type="password"
                        value={password}
                        handleChange={this.handleChange}
                        label="Password"
                        required
                    />
                    <FormInput 
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        handleChange={this.handleChange}
                        label="Confirm Password"
                        required
                    />
                    <CustomButton type="submit">SIGN UP</CustomButton>
                </form>
            </div>
        )
    }
}

export default SignUp;