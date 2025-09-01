import { useForm } from "react-hook-form";
import "../styles/UserRegister.css"; 

const Register = ({ isSidebarOpen }) => {
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
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`user-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <h2>➕ Register New User</h2>
      <div className="user-content">
        <form className="user-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="Name">Full Name</label>
          <input
            type="text"
            id="Name"
            placeholder="Enter your full name"
            {...register("Name", { required: "Name is required" })}
          />
          {errors.Name && <p className="error">{errors.Name.message}</p>}

          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            placeholder="Enter your email address"
            {...register("Email", { required: "Email is required" })}
          />
          {errors.Email && <p className="error">{errors.Email.message}</p>}

          <label htmlFor="Address">Address</label>
          <input
            type="text"
            id="Address"
            placeholder="Enter your address"
            {...register("Address", { required: "Address is required" })}
          />
          {errors.Address && <p className="error">{errors.Address.message}</p>}

          <label htmlFor="Password">Password</label>
          <input
            type="password"
            id="Password"
            placeholder="Enter your password"
            {...register("Password", { required: "Password is required" })}
          />
          {errors.Password && (
            <p className="error">{errors.Password.message}</p>
          )}

          <button type="submit" className="btn-submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
