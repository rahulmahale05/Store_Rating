import { useForm } from "react-hook-form";
import "../styles/Login.css";

const Register = ({ onSwitchToLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Registered successfully! Please login.");
        onSwitchToLogin();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="form-title">Register</h2>

        <label htmlFor="Name">Full Name</label>
        <input
          type="text"
          id="Name"
          {...register("Name", { required: "Name is required" })}
        />
        {errors.Name && <p className="error">{errors.Name.message}</p>}

        <label htmlFor="Email">Email</label>
        <input
          type="email"
          id="Email"
          {...register("Email", { required: "Email is required" })}
        />
        {errors.Email && <p className="error">{errors.Email.message}</p>}

        <label htmlFor="Address">Address</label>
        <input
          type="text"
          id="Address"
          {...register("Address", { required: "Address is required" })}
        />
        {errors.Address && <p className="error">{errors.Address.message}</p>}

        <label htmlFor="Password">Password</label>
        <input
          type="password"
          id="Password"
          {...register("Password", { required: "Password is required" })}
        />
        {errors.Password && <p className="error">{errors.Password.message}</p>}

        <button type="submit" className="submit-btn">Register</button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin} className="switch-link">
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
