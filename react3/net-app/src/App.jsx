//import { useState, useRef, useEffect } from 'react'
import { useState, useContext } from 'react'
import './App.css'
import { QueryClient, QueryClientProvider, useQuery, } from '@tanstack/react-query';
import { PosProvider } from './PosContext';
import PosContext from './PosContext';
import NetDataComponent from './NetDataComponent';

const queryClient = new QueryClient();

function App() {

  return (
    <PosProvider >
      <h1>ReST API</h1>
      <RootLayout />
    </PosProvider>
  )
}

function RootLayout() {
  const { count, setCount } = useContext(PosContext);
  return (
    <>
      <div className="card">
        <button onClick={() => setCount(() => 0)}>
          Display Data
        </button>
        <button onClick={() => setCount(() => 1)}>
          Add Data
        </button>
        <button onClick={() => setCount(() => 2)}>
          Update Data
        </button>
        <button onClick={() => setCount(() => 3)}>
          Delete Data
        </button>
      </div>
      {/* {count == 0 ? <QueryClientProvider client={queryClient}>        <DisplayData />      </QueryClientProvider>
        : count == 1 ? <CreateData /> : count == 2 ?
          <QueryClientProvider client={queryClient}><UpdateData /> </QueryClientProvider> :
          <QueryClientProvider client={queryClient}><DeleteData /> </QueryClientProvider>} */}
        <NetDataComponent  /> 
    </>
  )
}


function DisplayData() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('http://wardpi.cs.uwyo.edu:3000/api/scores').then(function (res) {
        return res.json();
      }),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  if (data.error) return 'Error, no data found';

  const listItems = data.data.map((item) =>
    <>
      {item.id}: {item.name} - {item.score} <br />
    </>
  );
  return (
    <div>
      <h1>Display Data Component</h1>
      <ul>{listItems}</ul>
    </div>
  )
}


function UpdateOneLine({ id, name, score }) {
  console.log("UpdateOneLine: ", id, name, score);
  //console.log("UpdateOneLine: ", id);
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
    fetch('http://wardpi.cs.uwyo.edu:3000/api/scores/' + id, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({name: formData.name, score: formData.score }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error adding data.' + error);
      });
  }

  return (
    <div>
      <form>
        <label>{formData.id}:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <input type="number" name="score" value={formData.score} onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}


function UpdateData() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('http://wardpi.cs.uwyo.edu:3000/api/scores').then(function (res) {
        return res.json();
      }),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  if (data.error) return 'Error, no data found';
  console.log(" hi there");

  const listItems = data.data.map((item) =>
    <>
      <UpdateOneLine {...item} />
      <br />
    </>
  );

  return (
    <>
      <div>
        <h1>Update Data Component</h1>
        <ul>{listItems}</ul>
      </div>
    </>
  )
}

function DeleteData() {

  const { setCount } = useContext(PosContext);

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('http://wardpi.cs.uwyo.edu:3000/api/scores').then(function (res) {
        return res.json();
      }),
  })


  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  if (data.error) return 'Error, no data found';
  const listItems = data.data.map((item) =>
    <>
      {item.id}: {item.name} - {item.score}
      <button onClick={() => {
        fetch(`http://wardpi.cs.uwyo.edu:3000/api/scores/${item.id}`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            alert('Data deleted successfully!');
            setCount(() => 0);
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('Error deleting data.' + error);
          });
      }}>Delete</button>
      <br />
    </>
  );
  return (
    <div>
      <h1>Delete  Data Component</h1>
      <ul>{listItems}</ul>
    </div>
  )
}

function CreateData() {
  const { setCount } = useContext(PosContext);
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
    fetch('http://wardpi.cs.uwyo.edu:3000/api/scores', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ name: formData.name, score: formData.score }),

    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert(data.message);
        setCount(() => 0);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error adding data.' + error);
      });
  }
  return (
    <div>
      <h1>Create Data Component</h1>
      <form>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <input type="number" name="score" value={formData.score} onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>

    </div>
  )
}

export default App
