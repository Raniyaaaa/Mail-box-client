import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";

const Inbox = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const email = localStorage.getItem("email");
                if (!email) {
                    console.error("No logged-in user email found in localStorage");
                    return;
                }

                const formattedEmail = email.replace(/[@.]/g, "");
                const response = await axios.get(`your_url/${formattedEmail}/received.json`);

                if (response.data) {
                    const fetchedEmails = Object.keys(response.data).map((key) => ({
                        id: key, 
                        ...response.data[key],
                    }));
                    setEmails(fetchedEmails);
                } else {
                    setEmails([]); 
                }
            } catch (error) {
                console.error("Error fetching emails:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    if (loading) {
        return <p>Loading emails...</p>;
    }

    if (emails.length === 0) {
        return <p>No emails received.</p>;
    }

    return (
        <div style={{ paddingTop: '2rem', marginLeft: '1rem' }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {emails.map((email) => (
                    <li key={email.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                        <Row>
                            <p><strong>{email.recipient}</strong></p>
                            <p><strong>{email.subject}</strong></p>
                            <p>{email.body}</p>
                            {email.attachment && (
                                <p>
                                    <strong>Attachment:</strong> <a href={email.attachment} download>Download</a>
                                </p>
                            )}
                        </Row>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inbox;
