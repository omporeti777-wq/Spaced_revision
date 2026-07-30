import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight
} from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import illustration from "../assets/login-illustration.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/");
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-left">
          <img src={illustration} alt="Illustration" />
        </div>

        <div className="login-right">

          <h1>Welcome Back!</h1>

          <p>
            Stay consistent, revise smart and achieve your goals.
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <FaEnvelope size={18}/>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">

              <FaLock size={18}/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
              </button>

            </div>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}

              {!loading && <FaArrowRight size={18}/>}
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt=""
              width="22"
            />

            Continue with Google

          </button>

          <p className="signup-link">
            Don't have an account?

            <Link to="/signup">
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}