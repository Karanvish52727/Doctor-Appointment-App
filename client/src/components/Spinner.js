import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = () => (
  <div className="d-flex justify-content-center spinner">
  <div className="spinner-border" role="status">
    <span className="sr-only" />
  </div>
  {/* /* <cliploader size="{50}" color="#191a1cff" loading="{true}"> </cliploader> */}
  </div>

);

export default Spinner;
