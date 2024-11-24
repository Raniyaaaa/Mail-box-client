
import { useState } from "react";
import { Navbar, Button, Col, Alert, Container, Row, Badge } from "react-bootstrap";
import ComposeEmail from "./ComposeEmail";
import Inbox from "./Inbox";

const Home = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [activeView, setActiveView] = useState("inbox");

  const handleShow = () => setShowCompose(true);
  const handleClose = () => setShowCompose(false);

  const emailCounts = {
    inbox: 5,
    unread: 2,
    starred: 1,
    draft: 3,
    sent: 10,
    archive: 7,
  };

  const renderActiveView = () => {
    if (activeView === "inbox") {
      return <Inbox />;
    }
    return <div className="text-center">No emails to display.</div>;
  };

  return (
    <>
      <Navbar
        bg="light"
        className="border-bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "4rem",
          padding: "0 1rem",
        }}
      >
        <Navbar.Brand className="text-primary fs-5 fw-bold">
          Welcome to your mailbox!!!
        </Navbar.Brand>
      </Navbar>
      <Container fluid className="py-4">
        <Row>
          <Col sm="2" className="text-center">
            <Button
              variant="primary"
              onClick={handleShow}
              className="mb-4 w-100 fw-bold"
              style={{ borderRadius: "0" }}
            >
              Compose
            </Button>
            <div className="d-flex flex-column">
              <Alert
                variant={activeView === "inbox" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => setActiveView("inbox")}
              >
                <span>Inbox</span>
                <Badge bg="none" text="dark">
                  {emailCounts.inbox}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "unread" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => setActiveView("unread")}
              >
                <span>Unread</span>
                <Badge bg="none" text="dark">
                  {emailCounts.unread}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "starred" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => setActiveView("starred")}
              >
                <span>Starred</span>
                <Badge bg="none" text="dark">
                  {emailCounts.starred}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "draft" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => setActiveView("draft")}
              >
                <span>Draft</span>
                <Badge bg="none" text="dark">
                  {emailCounts.draft}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "sent" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => setActiveView("sent")}
              >
                <span>Sent</span>
                <Badge bg="none" text="dark">
                  {emailCounts.sent}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "archive" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => setActiveView("archive")}
              >
                <span>Archive</span>
                <Badge bg="none" text="dark">
                  {emailCounts.archive}
                </Badge>
              </Alert>
            </div>
          </Col>
          <Col sm="9">
            {renderActiveView()}
          </Col>
        </Row>
      </Container>
      <ComposeEmail show={showCompose} onHide={handleClose} />
    </>
  );
};

export default Home;
