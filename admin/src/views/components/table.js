import React from 'react';
import { Table,Button,Popover,PopoverBody } from 'reactstrap';
import EditModal from './modal';

import GetPagination from './pagination';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

export default class CustomTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            popovers: [],
       
        };
        
    }
    componentDidMount() {
        this.addPopover(this.props.rows.length);
    }


    
    toggle = (index) => {
        let temp = this.state.popovers;
        temp[index] = !temp[index];
        this.setState({
            popovers: temp
        })
    }

    addPopover = (len) => {
        
        let tmp = new Array(len)
        tmp.fill(false);
        this.setState({
            popovers: tmp
        })
        
    }

    render () {
        var blocked,temporary;
        let pdfRows=[], pdfRow=[];

        const convertToPdf = () => {
            let doc = jsPDF('l');
            doc.setFontSize(12);
            doc.setFontStyle('bold');
            pdfRows.push(pdfRow);
            let head = this.props.headings.slice(0,this.props.headings.length-1);
            doc.autoTable({
                head: [head], 
                body: pdfRows, 
                theme: 'grid',
                columnStyles: {
                    15: {cellWidth: 15},
                    16:{cellWidth:10},
                    17: {cellWidth: 10}
                }
            });

            let name = "" + this.props.tableHeading + ".pdf";
            doc.save(name);
        }

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
                    } else if(ele === "temporary") {
                        
                        temporary = true;
                    }
                    //console.log(" inside getStatusCell in table:: status => ",ele); 
                    var temp = "status-"+ele;
                    return <td key = {ele}><span className = {temp}>{ele}</span></td>
                }
            })
        }

        const getSingleRow = (row, index) => {
            //console.log(<tr key = {row.user_id}>{Object.keys(row).map( (element) => this.getSingleCell( row[element] ) )}</tr>);
            blocked = false;
            temporary = false;
            let value;
            let popoverId = "popover"+index;
            
           
            
           //console.log("in getSingleRow in table => ",row);
            return <React.Fragment>
                
                {   
                    Object.keys(row).map( element => {
                    pdfRow.push(row[element]);
                    if(this.props.id === element){
                        value = row[element];
                    }   
                    var ele = row[element]; 
                    if( element !== "status") {
                        //console.log(" element => ", element);
                        let k = ""+element+ele;
                        return <td key = {k}>{ele}</td>
                    } else{
                        return getStatusCell(ele);
                    }
                })
                
                } 
                <td><i className="fa fa-ellipsis-h" aria-hidden="true" id ={popoverId} ></i>
                <Popover placement="left" isOpen={this.state.popovers[index]} target={popoverId} toggle={() => this.toggle(index)}>
                    <PopoverBody>
                        {this.props.provided === "true"? (blocked || temporary ? (!temporary?<Button onClick = {() => this.props.unblock(value, index)} style = {{ marginBottom:5}} >Unblock</Button>:<Button onClick = {() => this.props.unblock(value, index)} style = {{ marginBottom:5}} >Confirm</Button>)  : <Button onClick = {() => this.props.block(value, index)} style = {{ marginBottom:5}}>Block</Button> ): ""}
                        <Button style = {{ marginBottom:5}} onClick = {() => this.props.deleteIt(value, index)}>Delete</Button><EditModal index={index} id = {this.props.id} edit = {this.props.edit} data = {row} modalTitle = "Edit Info" buttonLabel = "Edit"/> 
                    </PopoverBody>
                </Popover></td>
                 
                
            </React.Fragment>
        }
        // <Button style = {{ marginBottom:5}} onClick = {() => edit(row)}>Edit</Button>
        const getRows = (rows) => {
            return rows.map( (row, index) => {
                if(pdfRow.length !== 0) {
                    pdfRows.push(pdfRow);
                    pdfRow = [];
                }
               // console.log("rows count in table => ", this.props.rowsCount);
                //console.log(<tr key={index+1}>{getSingleRow(row, index)}</tr>);
            return (<tr key={index+1}>{getSingleRow(row, index)}</tr>);
        });
        }

        return (
            <React.Fragment>
                
            <div className="fluid-container">
                <div className="row">
                    <div className="col-sm-9">
                    <h4 style={{display:"inline-block"}} className="tableHeading">{this.props.tableHeading}</h4>
                
                    </div>
                    <div className="col-sm-3">
                        <Button onClick={convertToPdf} className="pdfButton">Export To pdf</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                    <Table >
                        <thead className="theadFix">
                            <tr>    
                                {getTableHeadings(this.props.headings)}
                            </tr>

                        </thead>
                        <tbody>
                            {getRows(this.props.rows)}
                        </tbody>
                    </Table>
                    </div>
                </div>
            </div>
            <GetPagination getRows = {this.props.getData} getRowsCount = {this.props.getRowsCount}/>
            </React.Fragment>
        );
    }
}