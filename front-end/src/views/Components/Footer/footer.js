import React, {Component} from 'react';
import FooterBlock from './footer-block';
import {Container, Row, Col} from 'reactstrap'
import '../../../CSS/Components/Footer/footer.css';


class Footer extends Component {

    blocks (lists) {
        let content = [];     
    //    console.log(lists);
    
        for( var [key, val] of Object.entries(lists)){
            
            content.push(<Col key = {key}>{key}<div><FooterBlock list = {val}/></div></Col>)
//            console.log("con --  ",content);
        }        
        return content; 
    }  
              
    render () {
        return (
            
            <div className="footer-block">
            <Container >
                
                <Row>
                    {this.blocks(this.props.blocks)}
                </Row>
                <span>
                    <a href = "">blah! blah! blah!</a>
                </span>
            </Container>
            </div>
        );
    }
}

export default Footer;