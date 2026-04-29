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

const getTokenRole = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.role || "";
  } catch (error) {
    return "";
  }
};

function ProtectedRoute({ children, role }) {
  const tokenKey = `token_${role}`;
  const roleKey = `role_${role}`;
  const token = localStorage.getItem(tokenKey);
  const userRole = localStorage.getItem(roleKey) || getTokenRole(token || "");

  if (!token || !userRole || isTokenExpired(token) || userRole !== role) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(roleKey);

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
