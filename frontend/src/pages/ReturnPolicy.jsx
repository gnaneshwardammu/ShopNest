import React from "react";

const containerStyle = {
  maxWidth: "900px",
  margin: "50px auto",
  padding: "40px",
  backgroundColor: "#18181b",
  borderRadius: "16px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
};

const headingStyle = {
  color: "#f97316",
  fontSize: "2.2rem",
  textAlign: "center",
  marginBottom: "15px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  paddingBottom: "15px",
};

const subHeadingStyle = {
  color: "#f97316",
  marginTop: "30px",
  marginBottom: "12px",
  fontSize: "1.3rem",
};

const paragraphStyle = {
  color: "#d4d4d8",
  lineHeight: "1.9",
  fontSize: "1rem",
  marginBottom: "16px",
  textAlign: "justify",
};

const noteStyle = {
  marginTop: "30px",
  padding: "18px",
  backgroundColor: "#27272a",
  borderLeft: "4px solid #f97316",
  borderRadius: "8px",
  color: "#e4e4e7",
};

const ReturnPolicy = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Return & Refund Policy</h1>

      <p style={paragraphStyle}>
        Thank you for choosing our platform. We value your trust and strive to
        provide high-quality products and services. Please read this Return &
        Refund Policy carefully before making a purchase.
      </p>

      <h3 style={subHeadingStyle}>1. Digital Products</h3>

      <p style={paragraphStyle}>
        Our website primarily offers digital products such as online courses,
        source code, templates, e-books, and downloadable resources. Since
        these products are delivered instantly after purchase, they are
        generally <strong>non-returnable and non-refundable</strong>.
      </p>

      <h3 style={subHeadingStyle}>2. Refund Eligibility</h3>

      <p style={paragraphStyle}>
        Refund requests may be considered only in the following situations:
      </p>

      <ul style={{ color: "#d4d4d8", lineHeight: "2" }}>
        <li>Duplicate payment for the same product.</li>
        <li>Payment was deducted but access was not provided.</li>
        <li>Technical issues that prevent downloading or accessing the product.</li>
        <li>Refund requests approved after review by our support team.</li>
      </ul>

      <h3 style={subHeadingStyle}>3. Non-Refundable Purchases</h3>

      <ul style={{ color: "#d4d4d8", lineHeight: "2" }}>
        <li>Downloaded digital products.</li>
        <li>Completed online courses.</li>
        <li>Subscription fees after the billing period has started.</li>
        <li>Customized or personalized services.</li>
        <li>Products purchased during promotional or discount offers.</li>
      </ul>

      <h3 style={subHeadingStyle}>4. Refund Process</h3>

      <p style={paragraphStyle}>
        To request a refund, please contact our support team with your order
        details, payment receipt, and the reason for your request. Eligible
        refunds will be processed to the original payment method within
        <strong> 5–10 business days</strong> after approval.
      </p>

      <h3 style={subHeadingStyle}>5. Cancellation Policy</h3>

      <p style={paragraphStyle}>
        Orders for digital products cannot be cancelled once the product has
        been delivered or access has been granted. If you experience any issues,
        please contact us and we will do our best to resolve them.
      </p>

      <h3 style={subHeadingStyle}>6. Contact Us</h3>

      <p style={paragraphStyle}>
        If you have any questions regarding this Return & Refund Policy, please
        contact us at{" "}
        <a
          href="mailto:info@yourwebsite.com"
          style={{
            color: "#f97316",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          info@yourwebsite.com
        </a>
        .
      </p>

      <div style={noteStyle}>
        <strong>Last Updated:</strong> June 2026
        <br />
        By purchasing products or services from this website, you acknowledge
        that you have read, understood, and agreed to this Return & Refund
        Policy.
      </div>
    </div>
  );
};

export default ReturnPolicy;