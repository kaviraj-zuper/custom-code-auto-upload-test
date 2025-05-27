// Initialize the Zuper SDK client
window.zclient = window.ZClient.init();

// Listen to app registered event
window.zclient.on("app.registered", async function () {
  // Create a button with title "View Profitability"
  const buttonConfig = {
    id: "button-view-profitability",
    type: "BUTTON",
    icon: "badge",
    location: "BREADCRUMB",
    page: "job_details",
    className: "hover:bg-gray-400",
    title: "View Profitability",
    position: "left",
  };

  // Create the button and get its uid
  const buttonResponse = await window.zclient.invoke("ui.create", buttonConfig);
  if (!buttonResponse.uid) {
    console.error("Failed to create button:", buttonResponse.error);
    return;
  }

  // Create an instance using button uid
  const buttonInstance = window.zclient.instance(buttonResponse.uid);

  // On button click
  buttonInstance.on("click", async () => {
    try {
      // Get job details and extract job_uid
      const jobDetails = await window.zclient.get("job");
      if (!jobDetails.success) {
        console.error("Failed to get job details");
        return;
      }
      const job_uid = jobDetails.response?.job_uid;
      if (!job_uid) {
        console.error("Job UID not found");
        return;
      }

      // Get auth_token, dc_api_url, and company.company_uid from localStorage
      const auth_token = localStorage.getItem("auth_token") || "";
      const dc_api_url = localStorage.getItem("dc_api_url") || "";
      const company = JSON.parse(localStorage.getItem("company") || "{}");
      const company_uid = company.company_uid || "";

      // Configurable URL (replace with your actual URL)
      const baseUrl = "https://staging.zuperpro.com/api/customer_portal/jobs";
      const url = `${baseUrl}?job_uid=${encodeURIComponent(
        job_uid
      )}&auth_token=${encodeURIComponent(
        auth_token
      )}&dc_api_url=${encodeURIComponent(
        dc_api_url
      )}&company_uid=${encodeURIComponent(company_uid)}`;

      // Open page in new tab
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error in button click handler:", err);
    }
  });
});