import { useState } from "react";
import { compressImage } from "../../lib/image";

function ImageField({ label, value, onChange, maxSide }) {
  const [error, setError] = useState("");
  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      onChange(await compressImage(file, maxSide));
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      <div className="img-field">
        {value ? <img src={value} alt="" /> : <div className="img-empty">No photo</div>}
        <div className="img-actions">
          <label className="admin-btn">
            {value ? "Replace photo" : "Choose photo"}
            <input type="file" accept="image/*" onChange={pick} hidden />
          </label>
          {value && <button type="button" className="admin-btn danger" onClick={() => onChange("")}>Remove</button>}
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

export default ImageField;
