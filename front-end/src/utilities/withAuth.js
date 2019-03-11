import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import instance from './axiosUtility';

// import axios from 'axios';

const withAuth = (ComponentToProtect) => {

    return class  extends Component {
        constructor (props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false
            };
        };

        componentDidMount () {
            let token = localStorage.getItem('token')
            //console.log("in withAuth ", token);
            if ( token === null) {
                this.setState({
                    redirect: true,
                    loading: false
                });
            } else {
                //console.log("callin checkAuth api");
                instance.get('/checkAuth')
                .then( res => {
                    //console.log(" here is the response   ---  ", res.data);
                  if (res.status === 200) {
                      //console.log("in else status = 200 loading value ", this.state.loading);
                    if (res.data.success === false) {
                        //console.log(" here is the response blah  ---  ", res.data.success);
                        localStorage.clear();
                        this.setState({
                            redirect: true,
                            loading: false
                        });
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
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

            if(this.state.loading) {
                console.log(" -- in with auth -- loading  ")
                return <h1>loading</h1>;
            }


            if (this.state.redirect) {
                return <Redirect to = "/login" />;
            }

            return (
                
                    <ComponentToProtect {...this.props} />
                
            );
        }
    }
}

export default withAuth;