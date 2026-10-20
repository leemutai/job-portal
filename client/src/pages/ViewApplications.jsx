
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch applications for the logged-in company.
  const fetchCompanyJobApplications = useCallback(async () => {
    if (!companyToken) {
      setApplicants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/company/applicants`,
        {
          headers: { token: companyToken },
          timeout: 15000,
        }
      );

      if (data.success) {
        const applications = Array.isArray(data.applications)
          ? [...data.applications].reverse()
          : [];

        setApplicants(applications);
      } else {
        setApplicants([]);
        toast.error(data.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error(
        "Error fetching applications:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, companyToken]);

  // Fetch applications when the component loads.
  useEffect(() => {
    fetchCompanyJobApplications();
  }, [fetchCompanyJobApplications]);

  // Update application status and refresh the table.
  const changeJobApplicationStatus = async (id, status) => {
    if (!companyToken || updatingId) return;

    try {
      setUpdatingId(id);
      setOpenMenuId(null);

      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success(data.message || "Application status updated");
        await fetchCompanyJobApplications();
      } else {
        toast.error(data.message || "Failed to update application status");
      }
    } catch (error) {
      console.error(
        "Error updating application status:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update application status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-application-menu]")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!companyToken) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-2">
          View Applications
        </h2>
        <p className="text-red-500">
          Company authentication is missing. Please log in again.
        </p>
      </div>
    );
  }

  const validApplicants = applicants.filter(
    (item) => item?.userId && item?.jobId
  );

  if (validApplicants.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-2">
          View Applications
        </h2>
        <p className="text-gray-500">
          No applications have been received yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        View Applications
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">
                Job Title
              </th>
              <th className="py-2 px-4 text-left max-sm:hidden">
                Location
              </th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {validApplicants.map((applicant, index) => (
              <tr
                key={applicant._id || index}
                className="text-gray-700 hover:bg-gray-50"
              >
                <td className="py-2 px-4 border-b text-center">
                  {index + 1}
                </td>

                <td className="py-2 px-4 border-b">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                      src={applicant.userId.image || ""}
                      alt={applicant.userId.name || "Applicant"}
                    />
                    <span>
                      {applicant.userId.name || "Unknown applicant"}
                    </span>
                  </div>
                </td>

                <td className="py-2 px-4 border-b max-sm:hidden">
                  {applicant.jobId.title || "Unknown job"}
                </td>

                <td className="py-2 px-4 border-b max-sm:hidden">
                  {applicant.jobId.location || "Not specified"}
                </td>

                <td className="py-2 px-4 border-b">
                  {applicant.userId.resume ? (
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-blue-100"
                    >
                      Resume
                      <img
                        src={assets.resume_download_icon}
                        alt="Open resume"
                      />
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      No resume
                    </span>
                  )}
                </td>

                <td className="py-2 px-4 border-b">
                  {applicant.status === "Pending" ||
                  !applicant.status ? (
                    <div
                      className="relative inline-block"
                      data-application-menu
                    >
                      <button
                        type="button"
                        aria-label="Application actions"
                        aria-expanded={openMenuId === applicant._id}
                        disabled={updatingId === applicant._id}
                        onClick={(event) => {
                          event.stopPropagation();

                          setOpenMenuId((currentId) =>
                            currentId === applicant._id
                              ? null
                              : applicant._id
                          );
                        }}
                        className="text-gray-500 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                      >
                        {updatingId === applicant._id ? "..." : "..."}
                      </button>

                      {openMenuId === applicant._id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
                          <button
                            type="button"
                            disabled={updatingId === applicant._id}
                            onClick={() =>
                              changeJobApplicationStatus(
                                applicant._id,
                                "Accepted"
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 disabled:opacity-50"
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            disabled={updatingId === applicant._id}
                            onClick={() =>
                              changeJobApplicationStatus(
                                applicant._id,
                                "Rejected"
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span
                      className={
                        applicant.status === "Accepted"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {applicant.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
