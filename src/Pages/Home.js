import { useState } from "react";
import { Navbar, Button, Col, Alert, Container, Row, Badge } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ComposeEmail from "./ComposeEmail";
import { logout } from "../Store/AuthSlice";

const Home = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [activeView, setActiveView] = useState("inbox");
  const unreadCount = useSelector((state) => state.email.unreadCount);
  const totalReceivedMessages = useSelector((state) => state.email.receivedMessages.length);
  const totalSendMessages = useSelector((state) => state.email.sendMessages.length);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const handleShow = () => setShowCompose(true);
  const handleClose = () => setShowCompose(false);

  const handleNavigation = (view) => {
    setActiveView(view);
    navigate(`/home/${view}`);
  };

  const deleteHandler=()=>{
    dispatch(logout());
    navigate('/');
  }

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
        <Button variant="outline-danger" onClick={deleteHandler}>
          LOG OUT
        </Button>
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
                onClick={() => handleNavigation("inbox")}
              >
                <span>Inbox</span>
                <Badge bg="none" text="dark">
                  {totalReceivedMessages}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "unread" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => handleNavigation("unread")}
              >
                <span>Unread</span>
                <Badge bg="none" text="dark">
                  {unreadCount}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "starred" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => handleNavigation("starred")}
              >
                <span>Starred</span>
                <Badge bg="none" text="dark">
                  {0}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "draft" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => handleNavigation("draft")}
              >
                <span>Draft</span>
                <Badge bg="none" text="dark">
                  {0}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "send" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => handleNavigation("send")}
              >
                <span>Send</span>
                <Badge bg="none" text="dark">
                  {totalSendMessages}
                </Badge>
              </Alert>
              <Alert
                variant={activeView === "archive" ? "dark" : "primary"}
                className="w-100 text-center mb-0 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "0", cursor: "pointer" }}
                onClick={() => handleNavigation("archive")}
              >
                <span>Archive</span>
                <Badge bg="none" text="dark">
                  {0}
                </Badge>
              </Alert>
            </div>
          </Col>
          <Col sm="9">
            <Outlet />
          </Col>
        </Row>
      </Container>
      <ComposeEmail show={showCompose} onHide={handleClose}/>
    </>
  );
};

export default Home;
