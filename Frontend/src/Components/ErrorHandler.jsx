import { useRouteError, Link } from "react-router-dom";
export default function ErrorHandler() {
  const error = useRouteError();
  console.error(error); // Optional: Send to logging service

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Oops! Something went wrong.</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">Back to Safety</Link>
    </div>
  );
}

