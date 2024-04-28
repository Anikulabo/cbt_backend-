import { Modal, Button } from "react-bootstrap";
export const Questionupload = (props) => {
  return (
    <Modal show={props.showModal} onHide={() => props.actions.control("close")}>
      <Modal.Header closeButton>
        <Modal.Title>
          <center>
            <h3>Upload a Word document</h3>
          </center>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          placeholder="name of subject"
          className="container-fluid"
          onChange={(event) =>
            props.actions.updateactivity(event, "adminsubject")
          }
        />
        <br />
        <input
          type="text"
          placeholder="department taking the subject"
          className="container-fluid mt-3"
          onChange={(event) => props.actions.updateactivity(event, "admindept")}
        />
        <br />
        <div>
          <input
            className="mt-3"
            type="number"
            style={{ width: "10%" }}
            onChange={(event) =>
              props.actions.updateactivity(event, "admintime")
            }
          />
          <select className="mt-3" style={{ width: "30%" }}>
            <option
              value="min"
              style={{ padding: "5px" }}
              onClick={(event) => props.actions.settime(event)}
            >
              Minutes
            </option>
            <option
              value="hour"
              style={{ padding: "5px" }}
              onClick={(event) => props.actions.settime(event)}
            >
              Hours
            </option>
          </select>
        </div>

        <input
          className="mt-3"
          type="file"
          onChange={props.actions.handleFileChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            props.actions.control("close");
            props.actions.check();
          }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={props.actions.handleUpload}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
