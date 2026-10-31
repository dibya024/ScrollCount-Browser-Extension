import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../CSS/defaultPage.css";

const DefaultPage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-badge">
        <Sparkles size={15} />
        <span>Your digital wellbeing space</span>
      </div>

      <section className="welcome-content">
        <div className="welcome-icon">
          <Play size={28} fill="currentColor" />
        </div>

        <h1>
          Welcome to <span>ScrollCount.</span>
        </h1>

        <p>
          Scroll with awareness. Make every minute count.
          Take control of your Shorts-watching habits,
          one scroll at a time.
        </p>

        <button
          className="welcome-button"
          onClick={() => navigate("/history-page")}
        >
          Explore your activity
          <ArrowRight size={17} />
        </button>
      </section>

      <div className="welcome-footer">
        <span className="welcome-dot" />
        Your journey to mindful scrolling starts here.
      </div>
    </div>
  );
};

export default DefaultPage;
