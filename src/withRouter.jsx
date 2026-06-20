import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// react-router v6 dropped the `withRouter` HOC. This shim injects the
// router data class components used to get from `match`, `history`, etc.
export function withRouter(Component) {
  return function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} location={location} navigate={navigate} match={{ params }} />;
  };
}
