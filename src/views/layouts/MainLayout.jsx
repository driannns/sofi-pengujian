import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Footer } from "../../components/Footer";

export function MainLayout(props) {
  return (
    <React.Fragment>
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main h-100">{props.children}</main>
      </div>
      <Footer />
    </React.Fragment>
  );
}
