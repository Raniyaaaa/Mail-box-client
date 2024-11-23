import { fireEvent, render, screen,waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from "./Home";
import { useNavigate } from "react-router-dom";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe("SignUp component Tests", () => {

    test("show 'SignUp' on screen", () => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );
        expect(screen.getByText("SignUp")).toBeInTheDocument();
    });
    test("show 'Confirm Password' on screen", () => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    });
    test("change auth mode correctly", async() => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Have an Account? Login'))
        await waitFor(() => {
            expect(screen.queryByPlaceholderText("Confirm Password")).not.toBeInTheDocument();
        });
    });

    test("displays Sign Up button in Sign-Up mode", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
    });

    test("Don't display forgot password? button in Sign-Up mode", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(screen.queryByText("forgot password?")).not.toBeInTheDocument();
    });
})

describe("Login component Tests", () => {

    test("change auth mode correctly", async() => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Have an Account? Login'))
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
        });
    });

    test("Display forgot password? button in Login mode", async() => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Have an Account? Login'))
        await waitFor(() => {
            expect(screen.getByText("forgot password?")).toBeInTheDocument();
        });
        
    });
    
    test("successfully redirects to Home component after Sign Up", async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockImplementation(() => mockNavigate);
      
        render(
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<div>Home</div>} />
            </Routes>
          </BrowserRouter>
        );
      
        // Mock the fetch response for successful signup
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                idToken: "mock-id-token",
              }),
          })
        );
      
        // Simulate user interaction
        fireEvent.change(screen.getByPlaceholderText("Email"), {
          target: { value: "test@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
          target: { value: "password123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
          target: { value: "password123" },
        });
      
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
      
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/home");
        });

        global.fetch.mockClear();
      });

});