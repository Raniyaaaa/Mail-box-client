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

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Inbox from './Inbox';
import { deleteEmail } from '../Store/EmailSlice';

// Mock the deleteEmail function
jest.mock('../Store/EmailSlice', () => ({
  ...jest.requireActual('../Store/EmailSlice'),
  deleteEmail: jest.fn(),
}));

const mockStore = configureStore([thunk]);

const renderWithRedux = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Inbox Component - Delete Email Functionality', () => {
  const initialState = {
    email: {
      messages: [
        { id: '1', sender: 'user1@example.com', subject: 'Hello!', read: false },
        { id: '2', sender: 'user2@example.com', subject: 'React Testing', read: true },
      ],
      loading: false,
      error: null,
    },
  };

  it('dispatches deleteEmail action when delete button is clicked', async () => {
    renderWithRedux(<Inbox />, { email: initialState.email });

    // Verify initial state
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);

    // Click the delete button for the first email
    fireEvent.click(deleteButtons[0]);

    // Ensure deleteEmail is called with the correct arguments
    await waitFor(() => {
      expect(deleteEmail).toHaveBeenCalledWith('user1examplecom', '1');
    });
  });

  it('removes the email from the UI after deletion', async () => {
    const store = mockStore({
      email: {
        messages: [
          { id: '1', sender: 'user1@example.com', subject: 'Hello!', read: false },
        ],
        loading: false,
        error: null,
      },
    });

    renderWithRedux(<Inbox />, { email: store.getState().email });

    // Verify the email exists
    expect(screen.getByText('user1@example.com | Hello!')).toBeInTheDocument();

    // Simulate deletion
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Mock store update
    store.dispatch({ type: 'email/removeEmail', payload: '1' });

    // Wait for UI to update
    await waitFor(() => {
      expect(screen.queryByText('user1@example.com | Hello!')).not.toBeInTheDocument();
    });
  });
});
