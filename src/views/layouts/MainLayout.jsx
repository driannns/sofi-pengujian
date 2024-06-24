import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Footer } from "../../components/Footer";

export function MainLayout(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Bersihkan event listener ketika komponen unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth >= 992) {
      setIsOpen(false);
      setIsMinimized(true);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [windowWidth]);

  const getStyles = () => {
    if (windowWidth >= 992) {
      return {
        container: {
          marginLeft: isOpen ? 0 : "200px",
        },
      };
    } else {
      return {
        container: {
          marginLeft: 0,
        },
      };
    }
  };

  const styles = getStyles();
  return (
    <div
      className={`app header-fixed sidebar-fixed aside-menu-fixed ${
        isOpen ? "" : "sidebar-lg-show"
      } ${isMinimized ? "" : "brand-minimized sidebar-minimized"}`}
    >
      <Navbar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <div className="app-body">
        <Sidebar isOpenSidebar={isOpen} toggleMinimize={toggleMinimize} />
        <main className="main h-100" style={styles.container}>
          {props.children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
