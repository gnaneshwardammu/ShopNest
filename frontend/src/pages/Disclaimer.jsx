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

const Disclaimer = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Legal Disclaimer</h1>

      <p style={paragraphStyle}>
        The information, tutorials, code examples, products, and services
        available on this website are provided solely for educational and
        informational purposes. While we make every effort to ensure that the
        content is accurate and up to date, we make no guarantees regarding its
        completeness, accuracy, reliability, or suitability for any specific
        purpose.
      </p>

      <p style={paragraphStyle}>
        Any action you take based on the information provided on this website is
        entirely at your own risk. We shall not be held responsible for any
        losses, damages, or consequences resulting from the use of our content,
        products, or services.
      </p>

      <h3 style={subHeadingStyle}>External Links</h3>

      <p style={paragraphStyle}>
        Our website may contain links to third-party websites for your
        convenience. We do not control, endorse, or guarantee the accuracy,
        reliability, or availability of information found on these external
        websites. Visiting external links is entirely at your own discretion.
      </p>

      <h3 style={subHeadingStyle}>Limitation of Liability</h3>

      <p style={paragraphStyle}>
        Under no circumstances shall we be liable for any direct, indirect,
        incidental, consequential, or special damages arising from the use of,
        or inability to use, this website, including but not limited to loss of
        data, business interruption, or financial loss.
      </p>

      <h3 style={subHeadingStyle}>Content Updates</h3>

      <p style={paragraphStyle}>
        We reserve the right to modify, update, or remove any content on this
        website without prior notice. We recommend reviewing this page
        periodically to stay informed of any changes.
      </p>

      <h3 style={subHeadingStyle}>Contact Information</h3>

      <p style={paragraphStyle}>
        If you have any questions regarding this disclaimer, please contact us
        at{" "}
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
        By using this website, you acknowledge that you have read, understood,
        and agreed to this disclaimer and its terms.
      </div>
    </div>
  );
};

export default Disclaimer;