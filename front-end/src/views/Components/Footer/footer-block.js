import React, {Component} from 'react';
import '../../../CSS/Components/Footer/footer.css';

class FooterBlock extends Component {

    render () {
        
        const printer =  this.props.list.map( (item) => {   
            return ( <li key = {item.value}><a href = {item.link}>{item.value}</a></li> );             
        });

        return (     
            <div className="divi">
            <ul className="cust-ul">
            
                {printer}
            </ul>
            </div>
        );
    }
}

export default FooterBlock;