import { useState, useEffect } from "react";
export const Adminwelcome = (props) => {
  const [avatarSrc, setAvatarSrc] = useState(null);
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Dynamically import avatar based on user's username
        const avatar = await import("./img/" + props.name + ".jpg").catch(() =>
          import("./img/Avatart1.jpg")
        );
        setAvatarSrc(avatar.default);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, [props.name]);
  return (
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col-9">
          <div className="text-dark" style={{ fontWeight: "bolder" }}>
            Dashboard
          </div>
        </div>
        <div className="col-3">
          <div className="d-flex justify-content-end">
            <i
              className="fa fa-bell"
              style={{ marginTop: "5px", fontSize: "2rem" }}
            ></i>
            <img
              src={avatarSrc}
              alt="it should show an avatar"
              height="15%"
              width="15%"
              style={{
                alignSelf: "center",
                borderRadius: "50%",
                border: "2.5px solid white",
              }}
            />
            <span style={{marginLeft:"5px"}}>
              {props.name}
              <br />
              Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
