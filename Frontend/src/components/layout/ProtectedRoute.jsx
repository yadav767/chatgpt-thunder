import { useAuth } from "../../hooks/userAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const { user, status } = useAuth();

    if (status === "checkingSession") return <div>Loading...</div>
    if (status === "unauthenticated") return <Navigate to="/login" />

    return children;
}

export default ProtectedRoute;