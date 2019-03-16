import React from 'react';
import { Table,Button } from 'reactstrap';


export default class CustomTable extends React.Component { 

    render () {
        
        const buttonDisplay = buttons => {

            return buttons.map( button => {
                return Object.keys(button).map( buttonName => {
                    // if(buttonName ===)
                })
            })
        }

        const getTableHeadings = headings => {
            // return headings.map( ele => this.getHeadings(ele))
            return headings.map( (ele) => {
                return <th key = {ele}>{ele}</th>
            })
        }
    
        const getSingleRow = (row) => {
            //console.log(<tr key = {row.user_id}>{Object.keys(row).map( (element) => this.getSingleCell( row[element] ) )}</tr>);
            var blocked;
            return <React.Fragment>
                {Object.keys(row).map( element => {   
                    var ele = row[element]; 
                    if( element !== "status") 
                        return <td key = {ele}>{ele}</td>
                    else{
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
                })}<td><Button>{
                    blocked ? "Unblock": "Block"
                }</Button></td>
            </React.Fragment>
        }
    
        const getRows = (rows) => {
            return rows.map( (row) => {
            return (<tr key={row.user_id}>{getSingleRow(row)}</tr>)
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
            </React.Fragment>
        );
    }
}