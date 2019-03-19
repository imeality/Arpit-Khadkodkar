import React from 'react';
import { Table,Button } from 'reactstrap';
import EditModal from './modal';

import GetPagination from './pagination';

export default class CustomTable extends React.Component {
   
    render () {
        var blocked;


        const getTableHeadings = headings => {
            // return headings.map( ele => this.getHeadings(ele))
            return headings.map( (ele) => {
                return <th key = {ele}>{ele}</th>
            })
        }
        
        const getStatusCell = (ele) => {
            return this.props.status.map( (cstatus) => {
                if (cstatus === ele) {
                    if(ele === "blocked"){
                        blocked = true;
                    }
                    var temp = "status-"+ele;
                    return <td key = {ele}><span className = {temp}>{ele}</span></td>
                }
            })
        }

        const getSingleRow = (row, index) => {
            //console.log(<tr key = {row.user_id}>{Object.keys(row).map( (element) => this.getSingleCell( row[element] ) )}</tr>);
            blocked = false;
            var value;
           
            return <React.Fragment>
                
                {Object.keys(row).map( element => {
                    
                    if(this.props.id === element){
                        value = row[element];
                    }   
                    var ele = row[element]; 
                    if( element !== "status") {
                        return <td key = {ele}>{ele}</td>
                    } else{
                        return getStatusCell(ele);
                    }
                })
                }  
                 
                <td>{this.props.provided === "true"? blocked === true ? <Button onClick = {() => this.props.unblock(value, index)} style = {{ marginBottom:5}} >Unblock</Button>:<Button onClick = {() => this.props.block(value, index)} style = {{ marginBottom:5}}>Block</Button> : ""}
                <Button style = {{ marginBottom:5}} onClick = {() => this.props.deleteIt(value, index)}>Delete</Button><EditModal index={index} id = {this.props.id} edit = {this.props.edit} wait = {100} data = {row} modalTitle = "Edit Info" buttonLabel = "Edit"/></td>   
                
            </React.Fragment>
        }
        // <Button style = {{ marginBottom:5}} onClick = {() => edit(row)}>Edit</Button>
        const getRows = (rows) => {
            return rows.map( (row, index) => {
               // console.log("rows count in table => ", this.props.rowsCount);
                //console.log(<tr key={index+1}>{getSingleRow(row, index)}</tr>);
            return (<tr key={index+1}>{getSingleRow(row, index)}</tr>);
        });
        }

        return (
            <React.Fragment>
                <h4 className="tableHeading">{this.props.tableHeading}</h4>
            <Table  responsive  striped>
                <thead className="theadFix">
                    <tr>    
                        {getTableHeadings(this.props.headings)}
                    </tr>
                </thead>
                <tbody>
                    {getRows(this.props.rows)}
                </tbody>
            </Table>
            <GetPagination getRows = {this.props.getData} getRowsCount = {this.props.getRowsCount}/>
            </React.Fragment>
        );
    }
}