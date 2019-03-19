import React from 'react';

import {Pagination, PaginationItem, Button} from 'reactstrap';
import Axios from 'axios';
export default class GetPagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rowsCount:0,
            numberOfPages:0
        }
    }

    async componentDidMount() {
        Axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
         var rows;
         await this.props.getRowsCount
         .then(count => rows = count)
         .catch(error => console.log(error))

        console.log(" rows => ", rows);
        this.setState({
            rowsCount:rows
        }, () => {
            console.log(this.state.rowsCount);
            let num = this.state.rowsCount/10;
            console.log(num);
            num = this.ceil(num);
            this.setState({
                numberOfPages: num
            })
        })
        this.props.getRows(10, 0);
    }

    ceil = (number) => {
        if (number % 1 === 0) {
            return number;
        } else {
            console.log("numm o f pages ",parseInt(number/1+1));
            return (
                parseInt((number/1)+1)
                
            );
        }
    }

    render () {

        

        return (
            <Pagination>
            
            </Pagination>
        );
    }
}

