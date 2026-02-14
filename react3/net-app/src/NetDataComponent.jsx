import { useState, useEffect, useContext, useReducer } from 'react'
import PosContext from './PosContext';

const NetDataComponent = () => {
    const { count } = useContext(PosContext);
    const [data, dispatch] = useReducer(
        taskReducer, null
    );

    function fetchData() {
        fetch('http://wardpi.cs.uwyo.edu:3000/api/scores')
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            })
            .catch(error => {
                dispatch({ type: 'FETCH_ERROR', payload: error });
            });
    }
    //get the data on the first instance.  
    useEffect(() => {
        fetchData();
    }, []);


    function handleDeleteTask(id) {
        fetch(`http://wardpi.cs.uwyo.edu:3000/api/scores/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert(data.message);
                fetchData();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    function handleUpdateTask(id, name, score) {
        console.log("Submitting: ", id, name, score);
        fetch('http://wardpi.cs.uwyo.edu:3000/api/scores/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ name: name, score: score }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert(data.message);
                fetchData();
            })
            .catch((error) => {
                alert('Error updating data.' + error);
                console.error('Error:', error);
            });
    }
    function handleCreateTask(name, score) {
        fetch('http://wardpi.cs.uwyo.edu:3000/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert(data.message);
                fetchData();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error adding data.' + error);
            });
    }

    return (
        <>
            {count == 0 ? <DisplayData data={data} addData={handleCreateTask} />
                : count == 1 ? <CreateData addData={handleCreateTask} />
                    : count == 2 ?
                        <UpdateData data={data} updateData={handleUpdateTask} /> :
                        <DeleteData data={data} deleteData={handleDeleteTask} />}
        </>
    )
}

function taskReducer(state, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return action.payload;
        case 'FETCH_ERROR':
            return { error: 'Error fetching data' };
        default:
            return state;
    }
};

function DisplayData({ data, addData }) {
    if (data === null) {
        return <div>Loading...</div>;
    }
    const listItems = data.data.map((item) =>
        <li key={item.id}>
            {item.id}: {item.name} - {item.score} <br />
        </li>
    );
    return (
        <div>
            <h1>Display Data Component</h1>
            <ul>{listItems}</ul>
            <CreateData handleCreateTask={addData} />
        </div>
    )
}

function CreateData({ handleCreateTask }) {
    const [formData, setFormData] = useState({
        name: '',
        score: 0
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting: ", formData.name, formData.score);
        handleCreateTask(formData.name, formData.score);
    }

    return (
        <div>
            <h1>Create Data Component</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                <label>Score:</label>
                <input type="number" name="score" value={formData.score} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

function UpdateOneLine({ id, name, score, handleUpdateTask }) {
    console.log("UpdateOneLine: ", id, name, score);
    const [formData, setFormData] = useState({
        id: id,
        name: name,
        score: score
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting: ", formData.name, formData.score);
        handleUpdateTask(formData.id, formData.name, formData.score);
    }

    return (

        <form onSubmit={handleSubmit}>
            <label>{formData.id}:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            <input type="number" name="score" value={formData.score} onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>

    )
}

function UpdateData({ data, updateData }) {
    const listItems = data.data.map((item) =>
        <li key={item.id}  >
            <UpdateOneLine id={item.id} name={item.name} score={item.score} handleUpdateTask={updateData} />
            <br /> 
        </li>
    );
    return (
        <div>
            <h1>Update Data Component</h1>
            <ul>{listItems}</ul>
        </div>
    )
}

function DeleteData({ data, deleteData }) {
    const listItems = data.data.map((item) =>
        <li key={item.id}  >
            {item.id}: {item.name} - {item.score}
            <button onClick={() => {
                deleteData(item.id);
            }}>Delete</button>
            <br />
        </li>
    );
    return (
        <div>
            <h1>Delete  Data Component</h1>
            <ul>{listItems}</ul>
        </div>
    )
}

export default NetDataComponent