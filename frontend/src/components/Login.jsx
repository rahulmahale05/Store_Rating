import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../styles/Login.css";

const Login = ({ onLoginSuccess, setAdmin, onSwitchToRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [role, setRole] = useState("user"); // default role

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const onSubmit = async (data) => {
    // ---------------- Change Password Flow ----------------
    if (changePasswordMode) {
      if (role === "admin") {
        alert("Admin password cannot be changed");
        return;
      } 
      try {
        const endpoint =
          role === "user"
            ? "users/change-password"
            : role === "vendor"
            ? "vendors/change-password"
            : "users/change-password"; // admin handled as user

        const res = await fetch(`http://localhost:5000/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: role === "vendor" ? data.StoreId : data.Email,
            oldPassword: data.OldPassword,
            newPassword: data.NewPassword,
          }),
        });

        const result = await res.json();
        if (res.ok) {
          alert("Password changed successfully!");
          setChangePasswordMode(false);
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    // ---------------- Login Flow ----------------
    if (role === "admin") {
      if (data.Email === adminEmail && data.Password === adminPassword) {
        setAdmin(true);
        return;
      } else {
        alert("Invalid admin credentials");
        return;
      }
    }

    // API endpoint based on role
    const endpoint = role === "user" ? "users/login" : "vendors/login";

    try {
      const bodyData =
        role === "vendor"
          ? { storeId: data.StoreId, vendorName: data.VendorName, password: data.Password }
          : { Email: data.Email, Password: data.Password };

      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();
      if (res.ok && role=="user") {
        onLoginSuccess(result.user);
      }else if(res.ok && role=="vendor"){
        onLoginSuccess(null,result.vendor);
      }
       else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="form-title">
          {changePasswordMode ? "Change Password" : "Login"}
        </h2>

        {/* ---------------- Role Selector ---------------- */}
        <label htmlFor="role">Login as</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>

        {/* ---------------- Vendor Name Field ---------------- */}
        {role === "vendor" && (
          <>
            <label htmlFor="VendorName">Vendor Name</label>
            <input
              type="text"
              id="VendorName"
              {...register("VendorName", { required: "Vendor Name is required" })}
            />
            {errors.VendorName && <p className="error">{errors.VendorName.message}</p>}
          </>
        )}

        {/* ---------------- Email / Store ID Field ---------------- */}
        <label htmlFor={role === "vendor" ? "StoreId" : "Email"}>
          {role === "vendor" ? "Store ID" : "Your Email"}
        </label>
        <input
          type={role === "vendor" ? "text" : "email"}
          id={role === "vendor" ? "StoreId" : "Email"}
          {...register(role === "vendor" ? "StoreId" : "Email", {
            required:
              role === "vendor"
                ? "Store ID is required"
                : "Email is required",
          })}
        />
        {errors[role === "vendor" ? "StoreId" : "Email"] && (
          <p className="error">
            {errors[role === "vendor" ? "StoreId" : "Email"]?.message}
          </p>
        )}

        {changePasswordMode ? (
          <>
            <label htmlFor="OldPassword">Old Password</label>
            <div className="password-wrapper">
              <input
                type={showOldPassword ? "text" : "password"}
                id="OldPassword"
                {...register("OldPassword", {
                  required: "Old password is required",
                })}
              />
              <div
                className="show-password-btn"
                onClick={() => setShowOldPassword((prev) => !prev)}
              >
                {showOldPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                <span className="tooltip-text">
                  {showOldPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            {errors.OldPassword && (
              <p className="error">{errors.OldPassword.message}</p>
            )}

            <label htmlFor="NewPassword">New Password</label>
            <div className="password-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="NewPassword"
                {...register("NewPassword", {
                  required: "New password is required",
                })}
              />
              <div
                className="show-password-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                <span className="tooltip-text">
                  {showNewPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            {errors.NewPassword && (
              <p className="error">{errors.NewPassword.message}</p>
            )}
          </>
        ) : (
          <>
            <label htmlFor="Password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                {...register("Password", { required: "Password is required" })}
              />
              <div
                className="show-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                <span className="tooltip-text">
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            {errors.Password && <p className="error">{errors.Password.message}</p>}
          </>
        )}

        <button type="submit" className="submit-btn">
          {changePasswordMode ? "Change Password" : "Login"}
        </button>

        {!changePasswordMode ? (
          <>
            <p className="switch-text">
              Don’t have an account?{" "}
              <span onClick={onSwitchToRegister} className="switch-link">
                Register
              </span>
            </p>
            <p className="switch-text">
              Forgot your password?{" "}
              <span
                onClick={() => setChangePasswordMode(true)}
                className="switch-link"
              >
                Change Password
              </span>
            </p>
          </>
        ) : (
          <p
            className="switch-text switch-link"
            onClick={() => setChangePasswordMode(false)}
          >
            Back to Login
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
