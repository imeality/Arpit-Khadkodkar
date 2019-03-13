import React from 'react';


const Cards = (props) => {


    return (
        <div className="cards">
            <div className="cardsText">
                <h5>{props.heading}</h5>
                <h2>{props.amount}</h2>
            </div>
        </div>
    );
}

export default Cards; 