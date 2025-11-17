import "../styles/AddItemForm.css";
// adding and editing form component for items like decks or cards
function AddItemForm({ fields, values, onChange, onSubmit, onCancel, mode = "add" }) {
  return (
    <div className="add-form">
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <input
            type="text"
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="form-input"
          />
        </div>
      ))}

      <div className="form-buttons">
        <button onClick={onSubmit} className="form-btn form-btn-primary">
          {mode === "edit" ? "Save" : "Add"}
        </button>
        <button onClick={onCancel} className="form-btn form-btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddItemForm;
