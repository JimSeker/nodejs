//import { useState, useRef, useEffect } from 'react'
import { useState, useContext } from 'react'
import './App.css'
import { Mutation, QueryClient, QueryClientProvider, useMutation, useQuery, } from '@tanstack/react-query';
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
      {/* Uncomment one version or the other version. they do the same thing, but in very different ways */}

      {/* //uses react-query to fetch the data and display it.  Also uses react-query to handle the mutations for create, update, and delete. */}
      <QueryClientProvider client={queryClient}>
        {count == 0 ? <DisplayData />
          : count == 1 ? <CreateData /> : count == 2 ?
            <UpdateData /> :
            <DeleteData />}
       </QueryClientProvider>
      
      {/*//uses the context to keep track of which page we are on, and to update the page when the user clicks on the buttons.  
      //Also uses the context and useReducer to keep track of the data and to update the data when the user creates, updates, or deletes data. */}
      {/* <NetDataComponent /> */}
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
    <li key={item.id}>
      {item.id}: {item.name} - {item.score} <br />
    </li>
  );
  return (
    <div>
      <h1>Display Data Component</h1>
      <ul>{listItems}</ul>
      <CreateData />
    </div>
  )
}


function UpdateOneLine({ updateMutation, id, name, score }) {
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
    updateMutation.mutate({ id: formData.id, name: formData.name, score: formData.score });
  }

  return (
    <li key={formData.id}>
      <form>
        <label>{formData.id}:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <input type="number" name="score" value={formData.score} onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </li>
  )
}


function UpdateData() {
  const updateMutation = useMutation({
    mutationFn: ({ id, name, score }) => fetch('http://wardpi.cs.uwyo.edu:3000/api/scores/' + id, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ name: name, score: score }),
    }),
    onSuccess: () => {
      alert('Data updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['repoData'] });
    }
  });

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
      <UpdateOneLine updateMutation={updateMutation} {...item} />
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
  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`http://wardpi.cs.uwyo.edu:3000/api/scores/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      alert('Data deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['repoData'] });
    }
  })

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
    <li key={item.id}>
      {item.id}: {item.name} - {item.score}
      <button onClick={() => {
        deleteMutation.mutate(item.id);
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

function CreateData() {
  const { count, setCount } = useContext(PosContext);
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
        if (count == 1)
          setCount(() => 0);
        else {
          //on display page, so invalidate the query to get the new data.
          queryClient.invalidateQueries({ queryKey: ['repoData'] });
          setFormData({
            name: '',
            score: 0
          });
        }
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
