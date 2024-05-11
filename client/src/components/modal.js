import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./top.css"
export const RuleAlert = ({ showModal, handleClose, onStartTest }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>
          <center style={{ textDecoration: "underline" }}>
            <h3>Here are the rules for the test</h3>
          </center>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>1.please try to answer all question </p>
        <p>2. tha table is to navigate directly to a question</p>
        <p>
          3.Pleas do not create another tab or leave the site while the test is
          ongoing{" "}
        </p>
        <p>
          4.Failure to adhere to the rules above will lead to unintended
          consequences
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          style={{backgroundColor:"rgb(81, 194, 37)"}}
          onClick={() => {
            handleClose();
            onStartTest();
          }}
        >
          Start Test
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export const DecisionAlert = ({ time, ans, guide, action,showModal }) => {
  return (
    <Modal show={showModal} onHide={action} >
      <Modal.Body>
        <center>
          <h3>Are you sure you want to submit</h3>
        </center>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={(event) => {
            action(event,time, ans, guide);
          }}
        >
          Yes
        </Button>
        <Button
          variant="primary"
          onClick={(event) => {
            action(event,time, ans, guide);
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
