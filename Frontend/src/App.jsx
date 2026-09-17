import AppRoutes from './routes/AppRoutes.jsx'
import { ToastContainer } from "react-toastify";
function App() {

  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right"
        autoClose={2500}
        theme="dark"
        toastStyle={{
          background: "#111827",
          color: "#fff",
          border: "1px solid #10b981",
        }} />
    </>
  )

}
export default App