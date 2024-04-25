import avatar from "./img/Avatart1.jpg";

export const Students = () => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered" style={{maxHeight:"500px", overflowY:"visible"}}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Username</th>
            <th>Department</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img
                src={avatar}
                alt="User Image"
                className="img-fluid"
                style={{ maxWidth: "100px", maxHeight: "100px" , borderRadius:"50%"}}
              />
            </td>
            <td>John Doe</td>
            <td>Science</td>
            <td>Mathematics</td>
            <td>Active</td>
            <td>
              <button className="btn btn-primary">Return to Pending</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
