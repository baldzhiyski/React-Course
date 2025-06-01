import {useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function RouteErrorPage() {
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error?.data || error?.message || "Unknown error."}</p>

     <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default RouteErrorPage;
