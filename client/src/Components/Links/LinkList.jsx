import { useState } from "react";

const LinkList = ({ links, setLinks, isLoading }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (linkId) => {
    try {
      setDeletingId(linkId);
      const response = await fetch(
        `http://localhost:7000/api/links/${linkId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      setLinks((prev) => prev.filter((link) => link._id !== linkId));
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading your links...</p>
        </div>
      ) : links?.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No share links found. Create one above!
        </p>
      ) : (
        links?.map((link) => (
          <div
            key={link._id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  Link ID:{" "}
                  <span className="font-mono text-blue-600">{link.linkId}</span>
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Access Count: {link.accessCount || 0}</p>
                  <p>
                    Expires:{" "}
                    {link.expiresAt
                      ? new Date(link.expiresAt).toLocaleString()
                      : "Never"}
                  </p>
                  {link.passwordHash && (
                    <p className="text-yellow-600">Password Protected</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(link._id)}
                disabled={deletingId === link._id}
                className="bg-red-100 text-red-600 px-3 py-1.5 rounded-md 
                         hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                {deletingId === link._id ? "Deleting..." : "Delete"}
              </button>
            </div>
            {link.file && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  File:{" "}
                  <a
                    href={`/uploads/${link.file}`}
                    className="text-blue-500 hover:underline"
                  >
                    {link.file}
                  </a>
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LinkList;
