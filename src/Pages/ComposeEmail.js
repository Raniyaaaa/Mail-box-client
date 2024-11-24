import { EditorState } from "draft-js";
import { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { Modal, Form, Button } from "react-bootstrap";
import { BsTrash2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { sendEmail } from "../Store/EmailSlice";

const ComposeEmail = ({ show, onHide }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [attachment, setAttachment] = useState(null);
    const dispatch=useDispatch();
    
    const sendEmailHandler = () => {
        const emailContent = editorState.getCurrentContent().getPlainText();
        const formData = {
          recipient,
          subject,
          body: emailContent,
          sender: localStorage.getItem('email'),
        };
    
        const senderEmail = localStorage.getItem('email') ? localStorage.getItem('email').replace(/[@.]/g, '') : '';
        const receiveEmail = recipient.replace(/[@.]/g, '');
    
        dispatch(sendEmail(formData, senderEmail, receiveEmail));
        handleClose();
    };

    const handleClose = () => {
        setRecipient('');
        setSubject('');
        setEditorState(EditorState.createEmpty());
        onHide();
    };
    
    return (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="To"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  style={{ marginBottom: '10px' }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{ marginBottom: '10px' }}
                />
              </Form.Group>
            </Form>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: ['inline', 'fontSize', 'fontFamily', 'colorPicker', 'emoji', 'link', 'image'],
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="danger" onClick={handleClose}>
                <BsTrash2 />
              </Button>
              <Button variant="primary" onClick={sendEmailHandler}>
                Send
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      );
    };
    
    export default ComposeEmail;
    