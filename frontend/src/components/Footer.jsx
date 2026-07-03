import React from "react";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,1) 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "40px 20px",
        marginTop: "50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <h3 style={{ color: "#f97316", marginBottom: "10px" }}>ShopNest</h3>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: "0.90rem",
              maxWidth: "350px",
              lineHeight: 1.5,
            }}
          >
            A premium shopping experience with curated products, secure
            checkout, and thoughtful customer flows.
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link to="/about" style={{ color: "#a1a1aa", fontSize: "0.9rem"  }}>
            About Us
          </Link>
          <Link to="/return" style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            Return Policy
          </Link>
          <Link
            to="/disclaimer"
            style={{ color: "#a1a1aa", fontSize: "0.9rem" }}
          >
            Disclaimer
          </Link>
        </div>

        <div style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
