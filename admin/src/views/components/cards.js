import React from 'react';


const Cards = (props) => {

    const divStyle = {
        color: "black",
        height: "100px",
        width: "100px"
    }
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