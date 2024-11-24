import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../Store/store';
import { BrowserRouter as Router } from 'react-router-dom';
import Inbox from './Inbox';
import InboxDetails from './InboxDetails';

// Mocking the store for testing
jest.mock('../Store/EmailSlice', () => ({
  fetchReceivedEmails: jest.fn(),
  markAsRead: jest.fn(),
}));

// Test Case 1: Check Rendering of Unread Messages with Blue Dot
test('renders unread messages with blue dot', () => {
  const messages = [
    { id: 1, sender: 'john@example.com', subject: 'Hello', body: 'How are you?', read: false },
    { id: 2, sender: 'jane@example.com', subject: 'Meeting', body: 'Let\'s meet up.', read: true },
  ];

  render(
    <Provider store={store}>
      <Router>
        <Inbox messages={messages} />
      </Router>
    </Provider>
  );

  const unreadMessage = screen.getByText('Hello');
  expect(unreadMessage).toBeInTheDocument();
  expect(screen.getByText('Hello')).toHaveStyle('font-weight: bold');
});

// Test Case 2: Click on a Message to Mark as Read and Display Details
test('click on a message to mark as read and display details', async () => {
  const messages = [
    { id: 1, sender: 'john@example.com', subject: 'Hello', body: 'How are you?', read: false },
  ];

  render(
    <Provider store={store}>
      <Router>
        <Inbox messages={messages} />
      </Router>
    </Provider>
  );

  const message = screen.getByText('Hello');
  fireEvent.click(message);

  // Wait for the details of the clicked message to appear
  await waitFor(() => screen.getByText('From: john@example.com'));
  expect(screen.getByText('From: john@example.com')).toBeInTheDocument();
  expect(screen.getByText('Subject: Hello')).toBeInTheDocument();
});

// Test Case 3: Check Back Button in InboxDetails
test('click on the back button to go back to inbox', () => {
  const selectedMessage = { sender: 'john@example.com', subject: 'Hello', body: 'How are you?' };
  const backToInbox = jest.fn();

  render(<InboxDetails selectedMessage={selectedMessage} backToInbox={backToInbox} />);

  const backButton = screen.getByText('Back');
  fireEvent.click(backButton);

  expect(backToInbox).toHaveBeenCalled();
});

// Test Case 4: Handle Loading State
test('displays loading message', () => {
  render(
    <Provider store={store}>
      <Router>
        <Inbox loading={true} />
      </Router>
    </Provider>
  );

  const loadingMessage = screen.getByText('Loading...');
  expect(loadingMessage).toBeInTheDocument();
});

// Test Case 5: Handle Empty Message List
test('displays no messages available when list is empty', () => {
  render(
    <Provider store={store}>
      <Router>
        <Inbox messages={[]} />
      </Router>
    </Provider>
  );

  const noMessages = screen.getByText('No messages available.');
  expect(noMessages).toBeInTheDocument();
});

// Test Case 6: Handle Error State
test('displays error message when there is an error', () => {
  render(
    <Provider store={store}>
      <Router>
        <Inbox error="Something went wrong!" />
      </Router>
    </Provider>
  );

  const errorMessage = screen.getByText('Error: Something went wrong!');
  expect(errorMessage).toBeInTheDocument();
});
test('marks message as read when clicked', async () => {
    // Mock data with one unread message "Hello"
    const mockMessages = [{ text: 'Hello', read: false }];
  
    // Render the component with mock messages
    render(<InboxDetails messages={mockMessages} />);
  
    // Wait for the message 'Hello' to appear in the DOM
    const message = await screen.findByText('Hello');
    
    // Check that the message is initially not marked as read
    expect(message).toHaveStyle('color: black'); // Assuming unread messages have black color
  
    // Simulate clicking the message
    fireEvent.click(message);
  
    // After click, check that the message is marked as read (color should change to gray)
    expect(message).toHaveStyle('color: gray');  // Assuming read messages have gray color
  });

// Test Case 8: Ensure No Messages Show After a Delete or Empty State
test('ensures no messages show after deletion or empty list', async () => {
  const messages = [];

  render(
    <Provider store={store}>
      <Router>
        <Inbox messages={messages} />
      </Router>
    </Provider>
  );

  expect(screen.getByText('No messages available.')).toBeInTheDocument();
});
