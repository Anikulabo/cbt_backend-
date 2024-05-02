import { Children } from "react";
import { Modal, Button } from "react-bootstrap";
export const Questionupload = (props) => {
 const children=Children.toArray(props.children)
  return (
    <Modal show={props.showModal} onHide={() => props.actions.control("close")}>
      <Modal.Header closeButton>
        <Modal.Title>
          <center>
            <h3>{props.title}</h3>
          </center>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children.map((child,index)=><span key={index}>{child}</span>)}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            props.actions.control("close");
          }}
        >
          {props.footer.close}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.actions.mainfunction();
            props.actions.control("close");
          }}
        >
          {props.footer.mainfunction}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
