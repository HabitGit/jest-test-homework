import {renderWithRouter} from "../../tests/helper/renderWithRouter";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavBar from "./NavBar";



    test('Render', async () => {
        render(renderWithRouter(<NavBar />));
        const mainLink = screen.getByTestId('main-link');
        const aboutLink = screen.getByTestId('about-link');
        const usersLink = screen.getByTestId('users-link');
        await userEvent.click(aboutLink);
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
        await userEvent.click(mainLink);
        expect(screen.getByTestId('main-page')).toBeInTheDocument();
        await userEvent.click(usersLink);
        expect(screen.getByTestId('users-page')).toBeInTheDocument();
    })
