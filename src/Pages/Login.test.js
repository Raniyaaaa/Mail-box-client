import { fireEvent, render, screen,waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";


describe("Login component Tests", () => {

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

    test("Don't display forget Password?button in Sign-Up mode", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(screen.queryByText("forget password?")).not.toBeInTheDocument();
    });
});