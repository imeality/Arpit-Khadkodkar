import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import axios from 'axios';

export default function withAuth (ComponentToProtect) {

    return class extends Component {
        constructor () {
            super();
            this.state = {
                loading: true,
                redirect: false
            };
        };

        componentDidMount() {
            let token = localStorage.getItem('token')
            if ( token === null) {
                this.setState({
                    redirect: true,
                    loading: false
                });
            } else {
                axios.get('http://localhost:5005/checkAuth',token)
                .then( res => {
                  if (res.status == 200) {
                    this.setState({
                        loading: false
                    })
                  } else {
                    this.setState({
                        redirect: true,
                        loading: false
                    });
                  }  
                })
                
            }
        }

        render () {

            const {loading, redirect} = this.state;

            if(loading) {
                return null;
            }


            if (redirect) {
                return <Redirect to = "/login" />;
            }

            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}