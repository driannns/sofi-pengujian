import Modal from "react-bootstrap/Modal";

const ModalComponent = (props) => {
  return (
    <Modal className="modal fade" show={props.show} onHide={props.onHide}>
      {props.children}
    </Modal>
  );
};

export default ModalComponent;
