import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../Provider/AuthProvider";
import CreateLinkForm from "../../Components/Links/CreatLinkForm";
import LinkList from "../../Components/Links/LinkList";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:7000/api/links", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch links");

        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchLinks();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Share Links</h1>
      <CreateLinkForm setLinks={setLinks} />
      <LinkList links={links} setLinks={setLinks} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
