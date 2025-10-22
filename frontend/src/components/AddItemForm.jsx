
// adding and editing form component for items like decks or cards
function AddItemForm({ fields, values, onChange, onSubmit, onCancel, mode = "add"}) {
  return (
    <div className="add-form">
      {/* render input fields based on provided field definitions */}
      {fields.map((field) => (
        <div key={field.name}>
          <input
            type="text"
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        </div>

      ))}
      
      {/*if mode is edit, button shows "Save", else "Add" */}
      <button onClick={onSubmit}>
        {mode === "edit" ? "Save" : "Add"} 
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default AddItemForm;
