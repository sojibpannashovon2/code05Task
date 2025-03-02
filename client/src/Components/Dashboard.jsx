import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [links, setLinks] = useState([]);

  const handleDelete = () => {
    console.log("Nothing");
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get("/api/links", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLinks(res.data);
      } catch (err) {
        console.error("Error fetching links:", err);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="dashboard">
      <h2>My Links</h2>
      <div className="links-list">
        {links.map((link) => (
          <div key={link.linkId} className="link-card">
            <div className="link-meta">
              <span
                className={`status ${link.isPublic ? "public" : "private"}`}
              >
                {link.isPublic ? "Public" : "Private"}
              </span>
              <span className="access-count">Views: {link.accessCount}</span>
            </div>
            <a href={`/content/${link.linkId}`} className="link-url">
              {link.linkId}
            </a>
            <div className="link-actions">
              <button onClick={() => handleDelete(link.linkId)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
