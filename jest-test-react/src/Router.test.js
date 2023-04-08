import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import {MemoryRouter} from "react-router-dom";

describe('TEST app', () => {
    test('Router test', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>);
        const mainLink = screen.getByTestId('main-link');
        const aboutLink = screen.getByTestId('about-link');
        fireEvent.click(aboutLink);
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
        fireEvent.click(mainLink);
        expect(screen.getByTestId('main-page')).toBeInTheDocument();
    });

    test('Errore page test', () => {
        render(
            <MemoryRouter initialEntries={['/asdasd']}>
                <App />
            </MemoryRouter>);
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
})

