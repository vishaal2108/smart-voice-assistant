import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) {
      return true;
    }

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || !userRole || isTokenExpired(token) || userRole !== role) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    const loginPaths = {
      staff: "/staff-login",
      parent: "/parent-login",
      student: "/student-login",
    };
    const loginPath = loginPaths[role] || "/";
    return <Navigate to={loginPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
