import React from "react";
import "./forgotpassword.css";

function ForgotPassword() {
  return (
    <div className="forgotpassword overflow-hidden">
      <div className="containerforget">
        <div className="row d-flex justify-content-center">
          <div className="col-md">
            <div className="card mt-3 login-card justify-content-center">
              <div className="card-body">
                <h5 className="card-title text-center">Forgot Password?</h5>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 fw-bold">
                  Remember your password?
                  <a href="/" class="ms-2 text-blue-600 decoration-2 hover:underline font-medium">
                  Login here
                  </a>
                </p>
                <div className="form-group justify-content-center">
                  <input
                  type="email"
                  className="form-control mt-0"
                  placeholder="Enter email"
                  required 
                  aria-describedby="email-error"
                  />
                  <p class="mt-0 text-sm text-center">
                    You will receive a link to create a new password via email.
                  </p>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="submit-button btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

