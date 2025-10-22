import { useState } from "react";

function useItemManager(initialItems = []) {
    // State to hold the list of items
    const [items, setItems] = useState(initialItems);

    // Function to add a new item
    const addItem = (newItem) => {
        const values = Object.values(newItem);
        if (values.some((v) => v === undefined || v === null || v.toString().trim() === "")) {
            alert("Please fill in all fields.");
            return;
        }
        setItems([...items, { id: items.length + 1, ...newItem }]);
    };

    // Function to delete an item by ID
    const deleteItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    }

    // Function to update an item by ID
    const updateItem = (id, updatedFields) => {
        setItems(items.map((item) =>
            item.id === id ? { ...item, ...updatedFields } : item
        ));
    };

    return {
        items,
        addItem,
        deleteItem,
        updateItem
    };
}

export default useItemManager;