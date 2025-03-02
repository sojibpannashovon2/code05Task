import { useState } from "react";
import axios from "axios";

export default function LinkForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
    isPublic: true,
    password: "",
    expiresAt: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (file) data.append("file", file);
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      const res = await axios.post("http://localhost:7000/api/links", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(`Link created: ${res.data.link}`);
    } catch (err) {
      alert(`Error creating link ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <textarea
        placeholder="Enter text content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />
      <label>
        <input
          type="checkbox"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData({ ...formData, isPublic: e.target.checked })
          }
        />
        Public Link
      </label>
      {!formData.isPublic && (
        <input
          type="password"
          placeholder="Set password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      )}
      <input
        type="datetime-local"
        value={formData.expiresAt}
        onChange={(e) =>
          setFormData({ ...formData, expiresAt: e.target.value })
        }
      />
      <button type="submit">Create Link</button>
    </form>
  );
}
