import "./top.css";
export const Rightbottom = () => {
  return (
    <div style={{ position: "absolute", bottom: "30px" }}>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "0" }}
      >
        <i className="fa fa-upload" />
        upload a photo
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
        Center Button
      </button>
      <button
        className="text-light bg-lemon formb"
        style={{ position: "relative", left: "70%" }}
      >
        <i className="fa fa-paper-plane" />
        Register
      </button>
    </div>
  );
};
