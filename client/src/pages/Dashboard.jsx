import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashProducts from "../components/DashProducts";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrlParams = urlParams.get("tab");
    if (tabUrlParams) {
      setTab(tabUrlParams);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*DashSidebar*/}
        <DashSidebar />
      </div>
      {/*DashProfile*/}
      {tab === "profile" && <DashProfile />}
      {/*DashProfile*/}
      {tab === "products" && <DashProducts />}
    </div>
  );
};

export default Dashboard;
