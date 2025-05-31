
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import config from '../config';
// import { FaArrowLeft } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AllResults = () => {
//     const { user } = useAuth();
//     const [assessmentResults, setAssessmentResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchAllResults = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     throw new Error('No authentication token found');
//                 }

//                 // First get all enrolled courses
//                 const enrolledResponse = await fetch(`${config.API_BASE_URL}/api/Courses/enrolled`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (!enrolledResponse.ok) {
//                     throw new Error('Failed to fetch enrolled courses');
//                 }

//                 const enrolledCourses = await enrolledResponse.json();
//                 const processedEnrolledCourses = Array.isArray(enrolledCourses) ? enrolledCourses : 
//                                               (enrolledCourses.$values && Array.isArray(enrolledCourses.$values)) ? enrolledCourses.$values : [];

//                 // Get all assessment results for enrolled courses
//                 const allResults = [];
//                 for (const course of processedEnrolledCourses) {
//                     const assessments = await fetchAssessmentsForCourse(course.courseId);
//                     for (const assessment of assessments) {
//                         try {
//                             // Fetch assessment details to get maxScore
//                             const assessmentDetailsResponse = await fetch(
//                                 `${config.API_BASE_URL}/api/Assessments/${assessment.assessmentId}`,
//                                 {
//                                     headers: {
//                                         'Authorization': `Bearer ${token}`,
//                                         'Content-Type': 'application/json'
//                                     }
//                                 }
//                             );

//                             if (!assessmentDetailsResponse.ok) continue;
//                             const assessmentDetails = await assessmentDetailsResponse.json();

//                             // Fetch results for this assessment
//                             const resultsResponse = await fetch(
//                                 `${config.API_BASE_URL}/api/Results/student/${user.userId}/assessment/${assessment.assessmentId}`,
//                                 {
//                                     headers: {
//                                         'Authorization': `Bearer ${token}`,
//                                         'Content-Type': 'application/json'
//                                     }
//                                 }
//                             );

//                             if (resultsResponse.ok) {
//                                 const result = await resultsResponse.json();
//                                 const mappedResult = {
//                                     ...result,
//                                     assessmentTitle: assessment.title,
//                                     courseTitle: course.title,
//                                     courseId: course.courseId,
//                                     maxScore: assessmentDetails.maxScore || 0,
//                                     totalQuestions: assessmentDetails.questions?.length || 0
//                                 };
//                                 allResults.push(mappedResult);
//                             }
//                         } catch (err) {
//                             console.error(`Error fetching results for assessment ${assessment.assessmentId}:`, err);
//                             toast.error(`Failed to fetch results for ${assessment.title}`);
//                         }
//                     }
//                 }

//                 // Sort results by attempt date (most recent first)
//                 allResults.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
//                 setAssessmentResults(allResults);
//             } catch (err) {
//                 console.error('Error fetching assessment results:', err);
//                 setError(err.message || 'Failed to load assessment results');
//                 toast.error(err.message || 'Failed to load assessment results');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllResults();
//     }, [user.userId]);

//     const fetchAssessmentsForCourse = async (courseId) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No authentication token found');
//             }

//             const response = await fetch(`${config.API_BASE_URL}/api/Assessments/course/${courseId}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch assessments');
//             }

//             const data = await response.json();
//             return Array.isArray(data) ? data : 
//                    (data.$values && Array.isArray(data.$values)) ? data.$values : [];
//         } catch (err) {
//             console.error(`Error fetching assessments for course ${courseId}:`, err);
//             toast.error(`Failed to fetch assessments for course`);
//             return [];
//         }
//     };

//     if (loading) {
//         return (
//             <div className="container-fluid bg-white min-vh-100">
//                 <div className="container mt-5">
//                     <div className="text-center">
//                         <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
//                             <span className="visually-hidden">Loading...</span>
//                         </div>
//                         <p className="mt-3 text-dark">Loading assessment results...</p>
//                     </div>
//                 </div>
//                 <ToastContainer position="top-right" autoClose={5000} />
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid bg-white min-vh-100 py-5">
//             <ToastContainer position="top-right" autoClose={5000} />
//             <div className="container">
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h2 className="text-dark mb-0">All Assessment Results</h2>
//                     <Link to="/student-dashboard" className="btn btn-outline-primary">
//                         <FaArrowLeft className="me-2" />
//                         Back to Dashboard
//                     </Link>
//                 </div>

//                 {assessmentResults.length === 0 ? (
//                     <div className="alert alert-info" role="alert">
//                         No assessment results found.
//                     </div>
//                 ) : (
//                     <div className="table-responsive">
//                         <table className="table table-hover">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th>Assessment</th>
//                                     <th>Course</th>
//                                     <th>Score</th>
//                                     <th>Percentage</th>
//                                     <th>Attempt Date</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {assessmentResults.map(result => {
//                                     const percentage = result.maxScore > 0 
//                                         ? Math.round((result.score / result.maxScore) * 100)
//                                         : 0;

//                                     return (
//                                         <tr key={result.resultId}>
//                                             <td>
//                                                 <div className="d-flex align-items-center">
//                                                     <i className="bi bi-file-text text-primary me-2"></i>
//                                                     {result.assessmentTitle}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div className="d-flex align-items-center">
//                                                     <i className="bi bi-book text-success me-2"></i>
//                                                     {result.courseTitle}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <span className="badge bg-primary">
//                                                     {result.score} / {result.maxScore}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <div className="d-flex align-items-center">
//                                                     <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
//                                                         <div 
//                                                             className={`progress-bar ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
//                                                             role="progressbar"
//                                                             style={{ width: `${percentage}%` }}
//                                                             aria-valuenow={percentage}
//                                                             aria-valuemin="0"
//                                                             aria-valuemax="100"
//                                                         ></div>
//                                                     </div>
//                                                     <span className="text-nowrap">{percentage}%</span>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div className="d-flex align-items-center">
//                                                     <i className="bi bi-calendar3 text-muted me-2"></i>
//                                                     {new Date(result.attemptDate).toLocaleString()}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <Link 
//                                                     to={`/results/${result.resultId}`}
//                                                     className="btn btn-primary btn-sm rounded-pill"
//                                                 >
//                                                     <i className="bi bi-eye me-1"></i>
//                                                     View Details
//                                                 </Link>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             <style jsx>{`
//                 .progress {
//                     background-color: #e9ecef;
//                     border-radius: 0.5rem;
//                 }
//                 .progress-bar {
//                     transition: width 0.6s ease;
//                 }
//                 .table > :not(caption) > * > * {
//                     padding: 1rem;
//                 }
//                 .badge {
//                     font-size: 0.9rem;
//                     padding: 0.5rem 0.75rem;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default AllResults; 

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Get all enrolled courses
        const enrolledResponse = await fetch(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.COURSES.ENROLLED}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!enrolledResponse.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }

        const enrolledCourses = await enrolledResponse.json();
        const processedEnrolledCourses = Array.isArray(enrolledCourses)
          ? enrolledCourses
          : enrolledCourses.$values && Array.isArray(enrolledCourses.$values)
          ? enrolledCourses.$values
          : [];

        // Get all results
        const allResults = [];
        for (const course of processedEnrolledCourses) {
          const assessments = await fetchAssessmentsForCourse(course.courseId);
          for (const assessment of assessments) {
            try {
              // Try fetching by result IDs first
              const resultIds = JSON.parse(
                localStorage.getItem(`results_${assessment.assessmentId}`) ||
                  "[]"
              );
              if (resultIds.length > 0) {
                for (const resultId of resultIds) {
                  try {
                    const resultResponse = await fetch(
                      `${
                        config.API_BASE_URL
                      }${config.API_ENDPOINTS.RESULTS.GET_BY_ID(resultId)}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                          Accept: "application/json",
                        },
                      }
                    );

                    if (resultResponse.ok) {
                      const result = await resultResponse.json();
                      const mappedResult = {
                        ...result,
                        assessmentTitle: assessment.title,
                        maxScore: assessment.maxScore,
                      };
                      allResults.push(mappedResult);
                    }
                  } catch (err) {
                    console.error(`Error fetching result ${resultId}:`, err);
                  }
                }
              }

              // Try the assessment results endpoint as a fallback
              const resultsResponse = await fetch(
                `${
                  config.API_BASE_URL
                }${config.API_ENDPOINTS.RESULTS.GET_BY_ASSESSMENT(
                  assessment.assessmentId
                )}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                }
              );

              if (resultsResponse.ok) {
                const results = await resultsResponse.json();
                const processedResults = Array.isArray(results)
                  ? results
                  : results.$values && Array.isArray(results.$values)
                  ? results.$values
                  : [];

                const userResults = processedResults.filter(
                  (result) =>
                    result.userId.toLowerCase() === user.userId.toLowerCase()
                );

                const mappedResults = userResults.map((result) => ({
                  ...result,
                  assessmentTitle: assessment.title,
                  maxScore: assessment.maxScore,
                }));

                allResults.push(...mappedResults);
              }
            } catch (err) {
              console.error(
                `Error processing assessment ${assessment.assessmentId}:`,
                err
              );
            }
          }
        }

        // Sort results by attempt date (most recent first)
        allResults.sort(
          (a, b) => new Date(b.attemptDate) - new Date(a.attemptDate)
        );
        // setResults(allResults);
        // Deduplicate based on resultId
        const uniqueResultsMap = new Map();
        for (const result of allResults) {
          if (!uniqueResultsMap.has(result.resultId)) {
            uniqueResultsMap.set(result.resultId, result);
          }
        }
        setResults(Array.from(uniqueResultsMap.values()));
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchAllResults();
  }, [user.userId]);

  const fetchAssessmentsForCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${config.API_BASE_URL}${config.API_ENDPOINTS.ASSESSMENTS.GET_BY_COURSE(
          courseId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Failed to fetch assessments: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data)
        ? data
        : data.$values && Array.isArray(data.$values)
        ? data.$values
        : [];
    } catch (err) {
      console.error(`Error fetching assessments for course ${courseId}:`, err);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
return (
  <div className="container-fluid bg-black min-vh-100 py-5">
    <ToastContainer position="top-right" autoClose={5000} />
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-light mb-0">All Assessment Results</h2>
        <Link to="/student-dashboard" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" />
          Back to Dashboard
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="alert alert-info">
          No assessment results available yet.
        </div>
      ) : (
        <div className="row">
          {results.map((result) => (
            <div key={result.resultId} className="col-md-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card h-100 shadow-sm border border-primary"
                style={{ backgroundColor: "#000",
                  color: '#fff',
                  border: '2px solid #0d6efd'
                 }}
              >
                <div className="card-body" style={{ color: "#ffffff" }}>
                  <h5 className="card-title fw-bold">{result.assessmentTitle}</h5>
                  <div className="mb-3">
                    <span className="badge bg-primary me-2">
                      Score: {result.score} / {result.maxScore}
                    </span>
                    <span className="badge bg-success">
                      {Math.round((result.score / result.maxScore) * 100)}%
                    </span>
                  </div>
                  <p className="card-text">
                    Attempted on:{" "}
                    {new Date(result.attemptDate).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/results/${result.resultId}`}
                    className="btn btn-sm btn-primary mt-2"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default AllResults;
