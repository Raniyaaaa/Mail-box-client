import { EditorState } from "draft-js";
import { useState } from "react";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { Modal, Form, Button } from "react-bootstrap";
import { BsTrash2 } from "react-icons/bs";

const ComposeEmail = ({ show, onHide }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [attachment, setAttachment] = useState(null);

    const sendEmailhandler = async () => {
        const emailContent = editorState.getCurrentContent().getPlainText();
        const formData = {
            recipient: recipient,
            subject: subject,
            body: emailContent,
        };

        if (attachment) {
            formData.attachment = attachment;
        }

        let sendEmail = localStorage.getItem('email') ? localStorage.getItem('email').replace(/[@.]/g, '') : '';
        let receiveEmail = recipient.replace(/[@.]/g, '');

        try {
            // Send email to sender's "send" folder
            const senderResponse = await axios.post(`your_url/${sendEmail}/send.json`, formData);
            console.log("Sender email sent successfully:", senderResponse);

            // Send email to recipient's "received" folder
            const receiverResponse = await axios.post(`your_url/${receiveEmail}/received.json`, formData);
            console.log("Receiver email received successfully:", receiverResponse);

            handleClose();

        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    const handleClose = () => {
        // Reset the fields when the modal is closed
        setRecipient("");
        setSubject("");
        setEditorState(EditorState.createEmpty());
        setAttachment(null);
        onHide(); // Close the modal
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
                            style={{ marginBottom: "10px" }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            style={{ marginBottom: "10px" }}
                        />
                    </Form.Group>
                </Form>
                {/* Editor Area */}
                <div>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        toolbar={{
                            options: ['inline', 'fontSize', 'fontFamily', 'colorPicker', 'emoji', 'link', 'image'], // Enable all options
                            inline: {
                                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'] // Add strikethrough, monospace
                            },
                            fontSize: {
                                options: [8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72] // Font size options
                            },
                            fontFamily: {
                                options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'] // Font family options
                            },
                            colorPicker: true, // Enable color picker
                            emoji: true, // Enable emoji picker
                            link: { showOpenDialog: true }, // Enable link functionality
                            image: { uploadEnabled: true }, // Enable image upload
                        }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <Button aria-label="Trash" variant="danger" onClick={handleClose}>
                            <BsTrash2 />
                        </Button>
                        <Button variant="primary" onClick={sendEmailhandler}>
                            Send
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ComposeEmail;
