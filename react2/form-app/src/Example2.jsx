
import { useState } from "react";

function Example2() {
    const [scores, setScores] = useState(initialScores);
    
    return (
        <div>
            <h3>Example 2 simple form input.</h3>

            <ScoreList scores={scores} />
            <AddScore onAddScore={(score) => {
                setScores([...scores, score]);
            }} />   
        </div>
    );
}

function AddScore({ onAddScore }) {
    function handleSubmit(e) {
        e.preventDefault();
        const name = e.target.elements.name.value;
        const score = parseInt(e.target.elements.score.value, 10);
        onAddScore({ id: nextId++, name, score });
        e.target.reset();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" />
            <input name="score" type="number" placeholder="Score" />
            <button type="submit">Add Score</button>
        </form>
    );
}   

function ScoreList({ scores }) {
    return (
        <div>
            {scores.map(score => (
                <li key={score.id}>
                    <DisplayScore score={score} />
                </li>
            ))}
        </div>
    );
}

function DisplayScore({ score }) {
    return (
        <div>
            <p>Name: {score.name}, Score: {score.score}</p>
        </div>
    );
}


let nextId = 2;
const initialScores = [
    { id: 0, name: 'Jim', score: 3012 },
    { id: 1, name: 'michael', score: 2890 }
];



export default Example2;
