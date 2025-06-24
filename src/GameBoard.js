import React from "react";
import Data from "./Data";
import Card from "./Card";
import AnimalThemeData from "./AnimalThemeData";
import MonumentThemeData from "./MonumentThemeData";
import FlowersThemeData from "./FlowersThemeData";
function GameBoard() {
    const [theme, setTheme] = React.useState("Flowers");
    const [level, setLevel] = React.useState("easy");
    const [cardsArray, setCardsArray] = React.useState([]); 
    const [moves, setMoves] = React.useState(0);
    const [firstCard, setFirstCard] = React.useState(null);
    const [secondCard, setSecondCard] = React.useState(null);
    const [stopFlip, setStopFlip] = React.useState(false); 
    const [won, setWon] = React.useState(0);

    
    function NewGame() {
        setTimeout(() => {
            let themeData = Data;
            if (theme === "animals") themeData = AnimalThemeData;
            if (theme === "Monument") themeData = MonumentThemeData;
            if(theme == "Flowers") themeData = FlowersThemeData;
        
    
            let levelCount = 6;
            if (level === "medium") levelCount = 10;
            if (level === "hard") levelCount = 15;
    
            const shuffled = [...themeData].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, levelCount);
            const doubleCards = [...selected, ...selected].map((item, index) => ({
                ...item,
                id: index + 1,
                matched: false,
            }));
    
            const randomOrderArray = doubleCards.sort(() => 0.5 - Math.random());
            setCardsArray(randomOrderArray);
            setMoves(0);
            setFirstCard(null);
            setSecondCard(null);
            setWon(0);
        }, 1200);
    }

    
    function handleSelectedCards(item) {
        console.log(typeof item);
        if (firstCard !== null && firstCard.id !== item.id) {
            setSecondCard(item);
        } else {
            setFirstCard(item);
        }
    }

    
    React.useEffect(() => {
        if (firstCard && secondCard) {
            setStopFlip(true);
            if (firstCard.name === secondCard.name) {
                setCardsArray((prevArray) => {
                    return prevArray.map((unit) => {
                        if (unit.name === firstCard.name) {
                            return { ...unit, matched: true };
                        } else {
                            return unit;
                        }
                    });
                });
                setWon((preVal) => preVal + 1);
                removeSelection();
            } else {
                setTimeout(() => {
                    removeSelection();
                }, 1000);
            }
        }
    }, [firstCard, secondCard]);

    
    function removeSelection() {
        setFirstCard(null);
        setSecondCard(null);
        setStopFlip(false);
        setMoves((prevValue) => prevValue + 1);
    }

    
    React.useEffect(() => {
        NewGame();
    }, []);

    return (
        <div className="container">
            <div className="header">
                <h1>Memory Game</h1>
        </div>
            <div className="theme-selector">
            <label htmlFor="theme">Choose Theme: </label>
            <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="Flowers">Flowers</option>
                <option value="animals">Animals</option>
                <option value="Monument">Monument</option>
            </select>
        </div>
            <div className="level-selector">
                <label htmlFor="level">Select Level: </label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="easy">Easy (6 pairs)</option>
                    <option value="medium">Medium (10 pairs)</option>
                    <option value="hard">Hard (15 pairs)</option>
                </select>
            </div>
            <div className="board">
                {
                    
                    cardsArray.map((item) => (
                        <Card
                            item={item}
                            key={item.id}
                            handleSelectedCards={handleSelectedCards}
                            toggled={
                                item === firstCard ||
                                item === secondCard ||
                                item.matched === true
                            }
                            stopflip={stopFlip}
                        />
                    ))
                }
            </div>

            {won !== cardsArray.lenght / 2 ? (
                <div className="comments">Moves : {moves}</div>
            ) : (
                <div className="comments">
                    You Won in {moves} moves 
                </div>
            )}
            <button className="button" onClick={NewGame}>
                New Game
            </button>
        </div>
    );
}

export default GameBoard;