import React from "react";
import "./App.css";

function App() {
  // Urls
  const url = "https://bc-grocery-list.herokuapp.com";

  // Set state for items
  const [items, setItems] = React.useState([]);

  // Create Form initial State and set it as an empty string and 0
  const [createForm, setCreateForm] = React.useState({
    name: "",
    quantity: 0,
  });

  // Function that will grab the data from my rails server
  const getItems = async () => {
    const response = await fetch(url + "/");
    const data = await response.json();
    console.log(data);
    setItems(data);
  };

  //This will run the function once when the component first loads
  React.useEffect(() => {
    getItems();
    // If I wanted this function to run again I would put those trigger points in the array. But I only want it to run when the component first loads so I will leave it empty.
  }, []);

  // This function only returns jsx whenever the data is available from backend
  const loaded = () => (
    <>
      {items.map((item) => {
        return (
          <div className="list">
            <h2>
              {item.name}: {item.quantity}
            </h2>
            <button
              onClick={async () => {
                //Make delete request
                await fetch(url + "/" + item.id, {
                  method: "delete",
                });
                getItems();
              }}
            >
              Delete
            </button>
            <button onClick={handleUpdate}>Edit Item</button>
          </div>
        );
      })}
    </>
  );

  // Handle change function for my create form
  const createChange = (event) => {
    // Update the form state to what is currently in the current form (...createForm) and update the event target by the key name
    setCreateForm({ ...createForm, [event.target.name]: event.target.value });
    console.log(setCreateForm);
  };

  const handleUpdate = async (item) => {
    await fetch(url + "/" + item.id, {
      method: "puts",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    getItems();
  };

  // Handle creation of the form when it is submitted
  const handleSubmit = async (event) => {
    // Prevent Refresh
    event.preventDefault();
    // Make post request to create new food
    await fetch(url + "/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createForm),
    });
    // Fetch the updated list
    getItems();
    setCreateForm({
      name: "",
      quantity: 0,
    });
  };

  return (
    <div className="App">
      <h1>Add Groceries</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Food"
          value={createForm.name}
          onChange={createChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={createForm.quantity}
          onChange={createChange}
        />
        <input type="submit" value="Add to list" />
      </form>
      <h1>Grocery List</h1>
      {items.length > 0 ? loaded() : <h2>No Groceries Needed</h2>}
    </div>
  );
}
export default App;
