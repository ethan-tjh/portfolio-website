export default function ProjectForm({
  values,
  categories = [],
  onChange,
  onSubmit,
  busy,
  error,
  submitText,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!busy) {
      onSubmit(values);
    }
  }
  // Handler for adding multiple images
  function handleAddImage() {
    const imageUrl = prompt("Enter image URL or filename:");
    if (imageUrl && imageUrl.trim()) {
      const newImages = [...(values.additional_images || []), imageUrl.trim()];
      onChange({ target: { name: 'additional_images', value: newImages } });
    }
  }
  // Handler for removing an image
  function handleRemoveImage(index) {
    const newImages = (values.additional_images || []).filter((_, i) => i !== index);
    onChange({ target: { name: 'additional_images', value: newImages } });
  }

  return (
    <div className="page-centered">
      <div>
        <h1>Project Form</h1>
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group horizontal">
            <label htmlFor="project_name">
              Project Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={onChange}
              disabled={busy}
              required
            />
          </div>

          <div className="form-group horizontal">
            <label htmlFor="module_code">
              Module Code:
            </label>
            <input
              id="module_code"
              name="module_code"
              type="text"
              placeholder="e.g., C257"
              value={values.module_code}
              onChange={onChange}
              disabled={busy}
              required
            />
          </div>
          
          <div className="form-group horizontal">
            <label htmlFor="module_name">
              Module Name:
            </label>
            <input
              id="module_name"
              name="module_name"
              type="text"
              placeholder="e.g., Fundamentals of Design"
              value={values.module_name}
              onChange={onChange}
              disabled={busy}
              required
            />
          </div>

          <div className="form-group horizontal textarea-field">
            <label htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={onChange}
              disabled={busy}
              required
            />
          </div>

          <div className="form-group horizontal">
            <label htmlFor="img">
              Thumbnail:
            </label>
            <div className="file-upload-container">
              <input
                id="img"
                name="img"
                type="text"
                placeholder="Type a URL/the file name (e.g., project-image.png) or"
                value={values.img}
                onChange={onChange}
                disabled={busy}
              />
              <div 
                className="file-drop-zone"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    onChange({ target: { name: 'img', value: file.name } });
                  }
                }}
                onClick={() => document.getElementById('img-file-input').click()}
              >
                <p>📁 Drag & drop an image here, or click to browse</p>
                <p>(This will auto-fill the filename above)</p>
              </div>
              <input
                id="img-file-input"
                type="file"
                accept="image/*"
                className="file-input-hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    onChange({ target: { name: 'img', value: file.name } });
                  }
                }}
                disabled={busy}
              />
            </div>
          </div>

          <div className="form-group horizontal">
            <label>
              Additional Images:
            </label>
            <div style={{ flex: 1 }}>
              <button
                type="button"
                onClick={handleAddImage}
                disabled={busy}
                className="submit-btn add-image-btn"
              >
                + Add Image
              </button>
              {values.additional_images && values.additional_images.length > 0 && (
                <div className="additional-images-list">
                  {values.additional_images.map((img, index) => (
                    <div key={index} className="additional-image-item">
                      <span className="additional-image-text">
                        {index + 1}. {img}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={busy}
                        className="remove-image-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {(!values.additional_images || values.additional_images.length === 0) && (
                <p className="no-images-text">
                  No additional images added yet. These will be displayed in the project gallery (optional).
                </p>
              )}
            </div>
          </div>

          <div className="form-group horizontal">
            <label htmlFor="category">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={onChange}
              disabled={busy}
            >
              <option value="">Select a category...</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group horizontal">
            <label htmlFor="github_link">
              GitHub Link:
            </label>
            <input
              id="github_link"
              name="github_link"
              type="url"
              placeholder="https://github.com/username/repo"
              value={values.github_link}
              onChange={onChange}
              disabled={busy}
            />
          </div>

          <div className="form-group horizontal">
            <label htmlFor="demo_link">
              Demo Link:
            </label>
            <input
              id="demo_link"
              name="demo_link"
              type="url"
              placeholder="https://your-demo-url.com"
              value={values.demo_link}
              onChange={onChange}
              disabled={busy}
            />
          </div>

          {error && <div className="form-status error">{error}</div>}

          <button type="submit" className="submit-btn" disabled={busy}>
            {busy ? "Submitting..." : submitText}
          </button>
        </form>
      </div>
    </div>
  );
}