import { render, screen, fireEvent } from '@testing-library/react';
import ComposeEmail from './ComposeEmail'; // Adjust the path based on where the component is located
import axios from 'axios';
import { EditorState, ContentState } from 'draft-js';

jest.mock('axios');

test('renders ComposeEmail modal when show is true', () => {
  render(<ComposeEmail show={true} onHide={() => {}} />);

  // Check if the modal is visible
  expect(screen.getByText('Send')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('To')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument();
});

test('calls sendEmailhandler on Send button click', async () => {
  axios.post.mockResolvedValue({ data: 'Email sent' }); // Mock axios response

  render(<ComposeEmail show={true} onHide={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText('To'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Test Email' } });

  fireEvent.click(screen.getByText('Send'));

  expect(axios.post).toHaveBeenCalledTimes(1); // Check that axios was called once
  expect(axios.post).toHaveBeenCalledWith('your_url/test@example.com/send.json', expect.objectContaining({
    to: 'test@example.com',
    subject: 'Test Email',
    body: expect.any(String), // Assuming the editor content is sent as the body
  }));
});

it("modal closes and fields are reset after sending email", async () => {
  const onHideMock = jest.fn();
  axios.post = jest.fn().mockResolvedValue({});

  // Mock localStorage
  const email = "test@example.com";
  localStorage.setItem("email", email);

  // Render the component
  render(<ComposeEmail show={true} onHide={onHideMock} />);

  // Set field values
  fireEvent.change(screen.getByPlaceholderText("To"), {
      target: { value: "recipient@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Test Email" },
  });

  // Click Send
  await act(async () => {
      fireEvent.click(screen.getByText("Send"));
  });

  // Check that onHide was called
  expect(onHideMock).toHaveBeenCalled();

  // Check fields are reset
  expect(screen.getByPlaceholderText("To").value).toBe("");
  expect(screen.getByPlaceholderText("Subject").value).toBe("");
});


test('clicking Trash button clears form and closes modal', () => {
  const onHideMock = jest.fn();

  render(<ComposeEmail show={true} onHide={onHideMock} />);

  fireEvent.change(screen.getByPlaceholderText('To'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Test Email' } });

  fireEvent.click(screen.getByRole('button', { name: /trash/i }));

  expect(onHideMock).toHaveBeenCalled(); // Check if modal closed
  expect(screen.getByPlaceholderText('To').value).toBe(''); // Check if recipient field is reset
  expect(screen.getByPlaceholderText('Subject').value).toBe(''); // Check if subject field is reset
});
