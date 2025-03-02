// components/CreateLinkForm.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateLinkForm = ({ setLinks }) => {
  const [formData, setFormData] = useState({
    content: "",
    isPublic: true,
    password: "",
    expiresAt: "",
    file: null,
  });
  const [shareUrl, setShareUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (formData.file) formDataToSend.append("file", formData.file);
    if (formData.content) formDataToSend.append("content", formData.content);
    formDataToSend.append("isPublic", formData.isPublic);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("expiresAt", formData.expiresAt);

    try {
      const response = await axios.post(
        "http://localhost:7001/api/links",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      setShareUrl(response.data.link);
      toast.success("Link creation is successfully done");
      setLinks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Upload File:</label>
          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files[0] })
            }
            className="block w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Or Enter Text:</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
          />
          <label>Public Link</label>
        </div>

        {!formData.isPublic && (
          <div>
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-2">Expiration Date:</label>
          <input
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) =>
              setFormData({ ...formData, expiresAt: e.target.value })
            }
            className="p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Link
        </button>

        {shareUrl && (
          <div className="mt-4 p-2 bg-blue-100 rounded">
            <p>
              Shareable URL:{" "}
              <a href={shareUrl} className="text-blue-600">
                {shareUrl}
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateLinkForm;
