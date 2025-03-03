import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/items")
            .then(res => setItems(res.data))
            .catch(err => console.error("❌ Axios Error:", err));
    }, []);

    const addItem = () => {
        if (!newItem.trim()) {
            alert("Item name cannot be empty!");
            return;
        }
        axios.post("http://localhost:5000/items", { name: newItem })
            .then(res => setItems([...items, res.data]))
            .catch(err => alert("❌ Failed to add item"));
        setNewItem("");
    };

    const deleteItem = (id) => {
        axios.delete(`http://localhost:5000/items/${id}`)
            .then(() => setItems(items.filter(item => item._id !== id)))
            .catch(err => alert("❌ Failed to delete item"));
    };

    return (
        <div className="container">
            <h1>Item List</h1>
            <input 
                type="text" 
                value={newItem} 
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add item..."
            />
            <button onClick={addItem}>Add</button>

            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        {item.name} <button onClick={() => deleteItem(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
