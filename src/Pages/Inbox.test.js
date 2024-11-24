import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import Inbox from "./Inbox";
import axios from "axios";

jest.mock("axios");

describe("Inbox Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("displays 'No emails received.' when email list is empty", async () => {
    axios.get.mockResolvedValueOnce({ data: null }); // Mock empty response

    render(<Inbox />);

    await waitFor(() => {
      expect(screen.getByText("No emails received.")).toBeInTheDocument();
    });
  });

  test("displays a list of emails", async () => {
    // Mock localStorage to provide an email
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("test@example.com");
  
    // Mock Axios to return a list of emails
    axios.get.mockResolvedValueOnce({
      data: {
        email1: {
          recipient: "test@example.com",
          subject: "Test Subject",
          body: "Welcome!",
          attachment: null,
        },
      },
    });
  
    render(<Inbox />);
  
    await waitFor(() => {
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("Test Subject")).toBeInTheDocument();
      expect(screen.getByText("Welcome!")).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    // Mock localStorage to provide an email
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("test@example.com");
  
    // Mock axios to simulate an error during fetch
    axios.get.mockRejectedValueOnce(new Error("Network Error"));
  
    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  
    render(<Inbox />);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error fetching emails:", expect.any(Error));
    });
  
    console.error.mockRestore();
  });
  
  test("displays email attachments when available", async () => {
    const mockEmails = {
      email1: { 
        recipient: "test@example.com", 
        subject: "Attachment Test", 
        body: "Email with attachment", 
        attachment: "http://example.com/file.pdf" 
      },
    };
  
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "email") return "test@example.com";
      return null;
    });
  
    axios.get.mockResolvedValueOnce({ data: mockEmails });
  
    render(<Inbox />);
  
    await waitFor(() => {
      expect(screen.getByText("Attachment:")).toBeInTheDocument();
      expect(screen.getByText("Download")).toHaveAttribute("href", "http://example.com/file.pdf");
    });
  });
  
});
