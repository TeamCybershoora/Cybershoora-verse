export default function LoginFormStyle() {
  return (
    <style jsx global>{`
      body {
        background-image: url("/assets/bg.svg");
        background-position: top;
        background-size: cover;
        background-repeat: no-repeat;
        height: initial;
      }
      .auth-container, .auth-container.login-auth-container {
        display: flex;
        flex-direction: column;
        width: 75vh;
        margin: 5rem auto;
        border-radius: 16px;
        overflow: hidden;
        background: url("/assets/bg3.svg");
        box-shadow: 0 0 20px rgba(0,0,0,0.4);
        backdrop-filter: blur(5px);
        max-width: none;
      }
      .form-container, .login-form-container {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
      }
      @media (max-width: 600px) {
        .auth-container, .auth-container.login-auth-container {
          width: 85vw;
          margin: 50% auto;
          max-width: 98vw;
          border-radius: 12px;
        }
        .form-container, .login-form-container {
          padding: 2rem 2rem;
          max-width: 98vw;
          min-width: 0;
          width: 85vw;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
      }
      .form-title {
        font-size: 24px;
        font-weight: bold;
        color: #ff6a32;
        margin-bottom: 20px;
        text-align: center;
        font-family: "NeueMachina";
      }
      .form-group {
        margin-bottom: 1.25rem;
        width: 100%;
      }
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.95rem;
        font-family: "NeueMachina";
        color:rgb(205, 205, 205);
      }
      .input-field {
        width: 100%;
        padding: 0.75rem 1rem;
        background-color:rgba(111, 111, 111, 0.25);
        border: none;
        border-radius: 0.5rem;
        color: white;
        font-size: 0.95rem;
        transition: 0.3s ease;
      }
      .input-field:focus {
        outline: none;
        box-shadow: 0 0 0 2px #ff6a32;
      }
      .input-error {
        border: 1.5px solid #ff4d4f !important;
      }
      .input-success {
        border: 1.5px solid #4caf50 !important;
      }
      .submit-btn {
        width: 100%;
        background: #e95a22;
        border: none;
        padding: 12px;
        font-size: 16px;
        font-weight: bold;
        font-family: "NeueMachina";
        color: white;
        border-radius: 10px;
        transition: 0.3s ease;
        margin-bottom: 8px;
      }
      .submit-btn:hover {
        background:rgb(255, 255, 255);
        color: #e95a22;
      }
      .error-msg {
        color: #ff4d4f;
        margin-bottom: 10px;
        font-size: 15px;
        font-family: "NeueMachina";
        text-align: center;
      }
      .back-btn-home {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        background: none;
        border: none;
        cursor: pointer;
        margin-bottom: 1.2rem;
        font-size: 1.1rem;
        font-weight: 600;
        font-family: "NeueMachina";
        color: #ff6a32;
        transition: color 0.2s;
      }
      .back-btn-home:hover .back-arrow-circle {
        box-shadow: 0 0 0 3px #ff6a3233;
      }
      .back-arrow-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid #ff6a32;
        box-shadow: 0 2px 8px #ff6a3222;
        transition: box-shadow 0.2s;
      }
      .back-btn-text {
        color: #ff6a32;
        font-weight: 600;
        font-size: 1.1rem;
        font-family: "NeueMachina";
        letter-spacing: 0.01em;
      }
      .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0rem;
        margin-bottom: -4rem;
      }
      .shoora-logo {
        height: 70px;
        width: auto;
      }
      .password-group {
        position: relative;
      }
      .password-input-wrapper {
        position: relative;
        width: 100%;
      }
      .eye-btn {
        position: absolute;
        right: 0.8rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        z-index: 2;
      }
    `}</style>
  );
} 