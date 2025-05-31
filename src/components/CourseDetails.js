// Course Details
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useAuth } from "../context/AuthContext";


// const CourseDetails = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [course, setCourse] = useState(null);
//   const [assessments, setAssessments] = useState([]);
//   const [assessmentAttempts, setAssessmentAttempts] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   const handleDeleteAssessment = async (assessmentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(
//         `http://localhost:7197/api/Assessments/${assessmentId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to delete assessment");
//       }

//       setAssessments(
//         assessments.filter(
//           (assessment) => assessment.assessmentId !== assessmentId
//         )
//       );
//     } catch (err) {
//       console.error("Error deleting assessment:", err);
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         // Fetch course details
//         const courseResponse = await fetch(
//           `http://localhost:7197/api/Courses/${courseId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!courseResponse.ok) {
//           throw new Error("Failed to fetch course details");
//         }

//         const courseData = await courseResponse.json();
//         setCourse(courseData);

//         // Fetch assessments for the course
//         const assessmentsResponse = await fetch(
//           `http://localhost:7197/api/Assessments/course/${courseId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!assessmentsResponse.ok) {
//           throw new Error("Failed to fetch assessments");
//         }

//         const assessmentsData = await assessmentsResponse.json();
//         setAssessments(
//           Array.isArray(assessmentsData)
//             ? assessmentsData
//             : assessmentsData.$values && Array.isArray(assessmentsData.$values)
//             ? assessmentsData.$values
//             : []
//         );
//       } catch (err) {
//         console.error("Error fetching course details:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId]);

//   const handleDownload = (fileKey) => {
//     const fileData = localStorage.getItem(fileKey);
//     if (fileData) {
//       const link = document.createElement("a");
//       link.href = fileData;
//       link.download = course.localFile.name;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container-fluid bg-white min-vh-100">
//         <div className="container mt-5">
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container-fluid bg-white min-vh-100">
//         <div className="container mt-5">
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="container-fluid bg-white min-vh-100">
//         <div className="container mt-5">
//           <div className="alert alert-warning" role="alert">
//             Course not found
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid bg-white min-vh-100">
//       <div className="container mt-4">
//         <div className="row mb-4">
//           <div className="col-12">
//             <div className="card border-0 shadow-sm m-4 bg-white">
//               <div className="row g-0 m-4">
//                 <div className="col-md-6">
//                   {course.mediaUrl ? (
//                     <img
//                       src={course.mediaUrl}
//                       className="img-fluid rounded-start h-100 w-90"
//                       alt={course.title}
//                       style={{ objectFit: "cover", borderRadius: "20px" }}
//                     />
//                   ) : (
//                     <div className="bg-light h-100 d-flex align-items-center justify-content-center">
//                       <i
//                         className="bi bi-book text-muted"
//                         style={{ fontSize: "5rem" }}
//                       ></i>
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-md-6">
//                   <div className="card-body">
//                     <h1 className="card-title mb-3 text-dark">
//                       {course.title}
//                     </h1>
//                     <p className="card-text text-muted mb-4">
//                       Description: {course.description}
//                     </p>
//                     <div className="d-flex align-items-center mb-3">
//                       <div>
//                         <h6 className="mb-0 text-dark">Instructor</h6>
//                         <p className="text-muted mb-0">
//                           {course.instructor?.name}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="d-flex gap-2">
//                     <a className="btn btn-success d-flex align-items-center" href="#courseContent">
//   <i className="bi bi-play-fill me-2"></i>
//   Start Learning
// </a>

//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row container mx-auto">
//           <ul className="nav nav-tabs mb-4 bg-white">
//             <li className="nav-item">
//               <button
//                 className={`nav-link text-dark ${
//                   activeTab === "overview" ? "active fw-bold" : ""
//                 }`}
//                 onClick={() => setActiveTab("overview")}
//               >
//                 Overview
//               </button>
//             </li>
//             <li className="nav-item">
//               <button
//                 className={`nav-link text-dark ${
//                   activeTab === "content" ? "active fw-bold" : ""
//                 }`}
//                 onClick={() => setActiveTab("content")}
//               >
//                 Course Content
//               </button>
//             </li>
//             <li className="nav-item">
//               <button
//                 className={`nav-link text-dark ${
//                   activeTab === "materials" ? "active fw-bold" : ""
//                 }`}
//                 onClick={() => setActiveTab("materials")}
//               >
//                 Assessments
//               </button>
//             </li>
//           </ul>

//           <div className="tab-content bg-white">
//             {activeTab === "overview" && (
//               <div
//                 className="card border-0 shadow-sm bg-white m-4"
//                 id="courseContent"
//               >
//                 <div className="card-body">
//                   <h4 className="card-title mb-4 text-dark">Course Overview</h4>
//                   <div className="mb-4">
//                     <h5 className="text-dark">What you'll learn</h5>
//                     <ul className="list-unstyled">
//                       <li className="mb-2">
//                         <i className="bi bi-check-circle-fill text-success me-2"></i>
//                         Understanding of key concepts
//                       </li>
//                       <li className="mb-2">
//                         <i className="bi bi-check-circle-fill text-success me-2"></i>
//                         Practical application of knowledge
//                       </li>
//                       <li className="mb-2">
//                         <i className="bi bi-check-circle-fill text-success me-2"></i>
//                         Hands-on experience with real-world examples
//                       </li>
//                     </ul>
//                   </div>
//                   <div>
//                     <h5 className="text-dark">Requirements</h5>
//                     <ul className="list-unstyled">
//                       <li className="mb-2">
//                         <i className="bi bi-info-circle-fill text-primary me-2"></i>
//                         Basic understanding of the subject
//                       </li>
//                       <li className="mb-2">
//                         <i className="bi bi-info-circle-fill text-primary me-2"></i>
//                         Willingness to learn and practice
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "content" && (
//               <div className="card border-0 shadow-sm bg-white m-4">
//                 <div className="card-body">
//                   <h4 className="card-title mb-4 text-dark">
//                     Course Content
//                   </h4>
//                   {course.courseUrl && (
//                     <div className="mb-4">
//                       <div className="ratio ratio-16x9">
//                         <iframe
//                           src={course.courseUrl}
//                           title="Course Video"
//                           allowFullScreen
//                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                           className="rounded"
//                         ></iframe>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//              {activeTab === "materials" && (
//           <div className="card mb-4 shadow-sm p-4">
//           <h4 className="mb-4">Assessments</h4>
//           {assessments.length > 0 ? (
//             <div className="row">
//               {assessments.map((assessment) => (
//                 <div key={assessment.assessmentId} className="col-md-4 mb-4">
//                   <div className="card h-100">
//                     <div className="card-body">
//                       <h5 className="card-title">{assessment.title}</h5>
//                       <p>
//                         <span className="badge bg-info text-dark me-2">
//                           <i className="bi bi-question-circle me-1"></i>
//                           {assessment.questionCount} Questions
//                         </span>
//                         <span className="badge bg-warning text-dark">
//                           <i className="bi bi-star me-1"></i>
//                           Max Score: {assessment.maxScore}
//                         </span>
//                       </p>
//                       <p className="text-muted">Test your knowledge of the course material.</p>
//                     </div>
//                     <div className="card-footer bg-white border-0">
//                       {user?.role === "Instructor" ? (
//                         <div className="d-flex gap-2">
//                           <Link to={`/edit-assessment/${assessment.assessmentId}`} className="btn btn-outline-primary btn-sm">
//                             <i className="bi bi-pencil me-1"></i>Edit
//                           </Link>
//                           <button
//                             className="btn btn-outline-danger btn-sm"
//                             onClick={() =>
//                               window.confirm("Are you sure?")
//                                 ? handleDeleteAssessment(assessment.assessmentId)
//                                 : null
//                             }
//                           >
//                             <i className="bi bi-trash me-1"></i>Delete
//                           </button>
//                         </div>
//                       ) : assessmentAttempts[assessment.assessmentId] > 0 ? (
//                         <>
//                           <button className="btn btn-success w-100 mb-2" disabled>
//                             <i className="bi bi-check-circle me-2"></i>Completed
//                           </button>
//                           <Link to={`/all-results`} className="btn btn-outline-secondary w-100">
//                             <i className="bi bi-eye me-2"></i>View Results
//                           </Link>
//                         </>
//                       ) : (
//                         <Link to={`/assessment/${assessment.assessmentId}`} className="btn btn-primary w-100">
//                           <i className="bi bi-pencil-square me-2"></i>Take Assessment
//                         </Link>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="alert alert-info">
//               <i className="bi bi-info-circle me-2"></i>No assessments available.
//             </div>
//           )}
//         </div>
//       )}
//            </div>
//          </div>
//        </div>
//      </div>
//    );
//  };

//  export default CourseDetails;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";


const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [assessmentAttempts, setAssessmentAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:7197/api/Assessments/${assessmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete assessment");
      }

      setAssessments(
        assessments.filter(
          (assessment) => assessment.assessmentId !== assessmentId
        )
      );
    } catch (err) {
      console.error("Error deleting assessment:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch course details
        const courseResponse = await fetch(
          `http://localhost:7197/api/Courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch assessments for the course
        const assessmentsResponse = await fetch(
          `http://localhost:7197/api/Assessments/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!assessmentsResponse.ok) {
          throw new Error("Failed to fetch assessments");
        }

        const assessmentsData = await assessmentsResponse.json();
        const processedAssessments = Array.isArray(assessmentsData)
          ? assessmentsData
          : assessmentsData.$values && Array.isArray(assessmentsData.$values)
          ? assessmentsData.$values
          : [];

        setAssessments(processedAssessments);

        // Fetch assessment attempts for each assessment
        const attempts = {};
        for (const assessment of processedAssessments) {
          try {
            console.log(
              `Fetching results for assessment ${assessment.assessmentId}`
            );
            const resultsResponse = await fetch(
              `http://localhost:7197/api/Results/student/${user.userId}/assessment/${assessment.assessmentId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (resultsResponse.ok) {
              const results = await resultsResponse.json();
              console.log(
                `Results for assessment ${assessment.assessmentId}:`,
                results
              );

              // Check if results is an array or has $values property
              const processedResults = Array.isArray(results)
                ? results
                : results.$values && Array.isArray(results.$values)
                ? results.$values
                : results
                ? [results]
                : [];

              attempts[assessment.assessmentId] = processedResults.length;
              console.log(
                `Attempts for assessment ${assessment.assessmentId}:`,
                attempts[assessment.assessmentId]
              );
            } else {
              console.log(
                `No results found for assessment ${assessment.assessmentId}`
              );
              attempts[assessment.assessmentId] = 0;
            }
          } catch (err) {
            console.error(
              `Error fetching results for assessment ${assessment.assessmentId}:`,
              err
            );
            attempts[assessment.assessmentId] = 0;
          }
        }

        console.log("Final attempts object:", attempts);
        setAssessmentAttempts(attempts);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userId) {
      fetchCourseDetails();
    }
  }, [courseId, user]);

  const handleDownload = (fileKey) => {
    const fileData = localStorage.getItem(fileKey);
    if (fileData) {
      const link = document.createElement("a");
      link.href = fileData;
      link.download = course.localFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 bg-white text-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 bg-white text-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-5 bg-white text-light">
        <div className="alert alert-warning" role="alert">
          Course not found
        </div>
      </div>
    );
  }

  
  return (
        <div className="container-fluid bg-white min-vh-100">
        <div className="container mt-4">
        <div className="row mb-4">
        <div className="col-12">
       {/* Course Header */}
       <div className="card mb-4 shadow-sm">
         <div className="row g-0">
           <div className="col-md-6">
             {course.mediaUrl ? (
              <img
                src={course.mediaUrl}
                className="img-fluid h-100 w-100 rounded-start"
                style={{ objectFit: "cover", borderRadius: "0.5rem 0 0 0.5rem" }}
                alt={course.title}
              />
            ) : (
              <div className="bg-secondary text-center text-white d-flex justify-content-center align-items-center h-100" style={{ minHeight: '200px' }}>
                <i className="bi bi-book" style={{ fontSize: "4rem" }}></i>
              </div>
            )}
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center p-4">
            <h3 className="card-title">{course.title}</h3>
            <p className="text-muted">Description: {course.description}</p>
            <h6 className="mb-1">Instructor</h6>
            <p className="text-dark">{course.instructor?.name}</p>
            <a href="#courseContent" className="btn btn-primary mt-3">
              <i className="bi bi-play-fill me-2"></i>Start Learning
            </a>
          </div>
        </div>
      </div>
  
      {/* Nav Tabs */}
      <ul className="nav nav-tabs mb-4">
        {["overview", "content", "materials"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active fw-bold" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" ? "Overview" : tab === "content" ? "Course Content" : "Assessments"}
            </button>
          </li>
        ))}
      </ul>
  
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="card mb-4 shadow-sm p-4" id="courseContent">
            <h4>Course Overview</h4>
            <div className="mb-3">
              <h5>What you'll learn</h5>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Understanding of key concepts</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Practical application of knowledge</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i>Hands-on experience with real-world examples</li>
              </ul>
            </div>
            <div>
              <h5>Requirements</h5>
              <ul className="list-unstyled">
                <li><i className="bi bi-info-circle-fill text-primary me-2"></i>Basic understanding of the subject</li>
                <li><i className="bi bi-info-circle-fill text-primary me-2"></i>Willingness to learn and practice</li>
              </ul>
            </div>
          </div>
        )}
  
        {activeTab === "content" && course.courseUrl && (
          <div className="card mb-4 shadow-sm p-4" >
            <h4 className="mb-3">Course Content</h4>
            <div className="ratio ratio-16x9">
              <iframe
                src={course.courseUrl}
                title="Course Video"
                allowFullScreen
                className="rounded"
              ></iframe>
            </div>
          </div>
        )}
  
        {activeTab === "materials" && (
          <div className="card mb-4 shadow-sm p-4">
            <h4 className="mb-4">Assessments</h4>
            {assessments.length > 0 ? (
              <div className="row">
                {assessments.map((assessment) => (
                  <div key={assessment.assessmentId} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{assessment.title}</h5>
                        <p>
                          <span className="badge bg-info text-dark me-2">
                            <i className="bi bi-question-circle me-1"></i>
                            {assessment.questionCount} Questions
                          </span>
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-star me-1"></i>
                            Max Score: {assessment.maxScore}
                          </span>
                        </p>
                        <p className="text-muted">Test your knowledge of the course material.</p>
                      </div>
                      <div className="card-footer bg-white border-0">
                        {user?.role === "Instructor" ? (
                          <div className="d-flex gap-2">
                            <Link to={`/edit-assessment/${assessment.assessmentId}`} className="btn btn-outline-primary btn-sm">
                              <i className="bi bi-pencil me-1"></i>Edit
                            </Link>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                window.confirm("Are you sure?")
                                  ? handleDeleteAssessment(assessment.assessmentId)
                                  : null
                              }
                            >
                              <i className="bi bi-trash me-1"></i>Delete
                            </button>
                          </div>
                        ) : assessmentAttempts[assessment.assessmentId] > 0 ? (
                          <>
                            <button className="btn btn-success w-100 mb-2" disabled>
                              <i className="bi bi-check-circle me-2"></i>Completed
                            </button>
                            <Link to={`/all-results`} className="btn btn-outline-secondary w-100">
                              <i className="bi bi-eye me-2"></i>View Results
                            </Link>
                          </>
                        ) : (
                          <Link to={`/assessment/${assessment.assessmentId}`} className="btn btn-primary w-100">
                            <i className="bi bi-pencil-square me-2"></i>Take Assessment
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>No assessments available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    </div>

  );
  
};

export default CourseDetails;
