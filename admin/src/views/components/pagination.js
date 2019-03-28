import React from 'react';

import {Pagination, PaginationItem, Button} from 'reactstrap';
import Axios from 'axios';

const PageItems = (props) => {
   
    let arr = [];
    let i;
  
    for( i=0; i< props.numberOfPages; i++){
    
       let cc = i*10;
        arr.push(
            <PaginationItem className = "paginationItem" key = {i}>
                <Button id = {i+1} onClick = {(event) => {props.getRows(10, cc);props.currentPage(event)}} >{i+1}</Button>
            </PaginationItem>
        );
        
    } 
    return arr;
}

export default class GetPagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rowsCount:0,
            numberOfPages:0,
            current:0,
            prevDisable:false,
            nextDisable:false,
            next:0,
            prev:0,
            prevId:0,
            nextId:0,
            last:0
        }
    }

    async componentDidMount() {
        Axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
         var rows;
         await this.props.getRowsCount
         .then(count => rows = count)
         .catch(error => console.log("pagination error in getRowsCount => ",error))

        //console.log(" in pagination component rows => ", rows);
        this.setState({
            rowsCount:rows
        }, () => {
            //console.log(this.state.rowsCount);
            let num = this.state.rowsCount/10;
            //console.log(num);
            num = this.ceil(num);
            let temp = (num*10)-10;
            //console.log("in pagination temp is ",temp);
            this.setState({
                numberOfPages: num,
                prevDisable:true,
                nextId:10,
                next:temp,
                nextDisable:false,
                last:temp
                
            })
        })
            this.props.getRows(10, 0);
    }

    ceil = (number) => {
        if (number % 1 === 0) {
            return number;
        } else {
            //console.log("numm o f pages ",parseInt(number/1+1));
            return (
                parseInt((number/1)+1)
                
            );
        }
    }

    currentPage = async (event) => {
        var id = parseInt(event.target.id);
        var nextD=false, prevD=false, nextV=0, prevV=0;
        if(id === 1) {
            //console.log(" in first if ");
            prevD = true;
            nextV = 10;
            
        } else if (id === this.state.numberOfPages) {
            //console.log(" in second if ");
            nextD = true;
            prevV = (id-1)*10-10;
           
        } else {
        
            //console.log(" in else ");
            nextV = (id+1)*10-10;
            prevV = (id-1)*10-10;
        }
        //console.log(" id is  ",id," prevD is ",prevD," nextD is ",nextD, " prevV is ",prevV," nextV is ",nextV," numberOfPages is ",this.state.numberOfPages);
        await this.setState({
            current:id,
            prevDisable:prevD,
            nextDisable:nextD,
            next:nextV,
            prev:prevV,
            nextId:id+1,
            prevId:id-1
        })
        
    }

    changeStateButton = async (event) => {
        let dataId = event.currentTarget.dataset.id;
        if(dataId === "firstBut") {

            await this.setState({
                current:1,
                prevDisable:true,
                nextDisable:false,
                nextId:2,
                next:10
            })
        } else if(dataId === "prevBut") {
            let current = this.state.current;
            let pd=false;
            if(current-1 === 1) {
                pd = true;
            }
            let nextV = current*10-10;
            let prevV = (current-2)*10-10;
            await this.setState({
                current: current-1,
                prevId:current-2,
                nextId:current,
                nextDisable:false,
                prevDisable:pd,
                next:nextV,
                prev:prevV
            })
        } else if(dataId === "lastBut") {
            let current = this.state.numberOfPages;
            let prevV = (current-1)*10-10;
            await this.setState({
                current:current,
                nextDisable:true,
                prevDisable:false,
                prevId:current-1,
                prev:prevV
            })
        }  else {
            let current = this.state.current,nd = false;
            
            if(current+1 === this.state.numberOfPages) {
                nd = true;
            }
            let nextV = (current+2)*10-10;
            let prevV = current*10-10;
            await this.setState({
                current: current+1,
                nextDisable: nd,
                prevDisable: false,
                nexId:current+2,
                prevId:current,
                next: nextV,
                prev:prevV
            })
        }
    }
    // changeStateFont = (event) => {
        
    //     event.stopPropagation();
    //     console.log("italic called => ");
    // }

    render () {
        const num = this.state.numberOfPages;

        if(num>1) {
            return (
                <Pagination>
                    <PaginationItem className = "paginationItem">
                    <Button value = "firstBut" data-id="firstBut" onClick = {(event) => {this.props.getRows(10, 0);this.changeStateButton(event)}}  disabled = {this.state.prevDisable}><i className = "fa fa-angle-double-left" aria-hidden="true"></i></Button>
                    </PaginationItem>
                    <PaginationItem className = "paginationItem">
                    <Button id = {this.state.prevId} data-id="prevBut" onClick = {(event) => {this.props.getRows(10, this.state.prev);this.changeStateButton(event)}} disabled = {this.state.prevDisable} ><i className="fa fa-angle-left" aria-hidden="true"></i></Button>
                    </PaginationItem>
    
                    <PageItems getRows = {this.props.getRows} currentPage = {this.currentPage} numberOfPages = {this.state.numberOfPages}/>
    
                    <PaginationItem className = "paginationItem">
                    <Button id={this.state.nextId} data-id = "nextBut" onClick = {(event) => {this.props.getRows(10, this.state.next);this.changeStateButton(event)}} disabled = {this.state.nextDisable}><i className="fa fa-angle-right" aria-hidden="true"></i></Button>
                    </PaginationItem>
                    <PaginationItem className = "paginationItem">
                    <Button data-id = "lastBut" onClick = {(event) => {this.props.getRows(10, this.state.last);this.changeStateButton(event)}} disabled = {this.state.nextDisable}><i className="fa fa-angle-double-right" aria-hidden="true"></i></Button>
                    </PaginationItem>
                </Pagination>
            );
        }

        return ("");
    }
}

