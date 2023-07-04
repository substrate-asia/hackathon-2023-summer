import { NavLink } from "react-router-dom";
import "./Button.css";
function Button({ size = "md" }: { size: string }) {
  return (
    <>
      <button
        type="button"
        className={`btn primary outlined contained secondary ${size}`}
      >
        <NavLink to="/list">
          <span>Launch App</span>
        </NavLink>
      </button>
    </>
  );
}

export default Button;
