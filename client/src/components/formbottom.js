import "./top.css";
export const Rightbottom = () => {
  return (
    <div style={{ position: "absolute", bottom: "30px" }}>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "0" }}
      >
        <i className="fa fa-upload" />
        <span style={{marginLeft:"10px"}}>Upload a photo</span>
      </button>
      <button
        className="text-light bg-lemon formb"
        style={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <i className="fa fa-camera" />
        <span style={{marginLeft:"10px"}}>Take a photo</span>
      </button>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "70%" }}
      >
        <i className="fa fa-paper-plane" />
        <span style={{marginLeft:"10px"}}>Register</span>
      </button>
    </div>
  );
};
