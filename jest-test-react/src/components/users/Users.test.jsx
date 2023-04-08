import {render, screen} from '@testing-library/react';
import Users from "./Users";
import mockAxios from "jest-mock-axios";
import {MemoryRouter} from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import AppRouter from "../../router/AppRouter";
import {renderWithRouter} from "../../tests/helper/renderWithRouter";

describe('TEST app', () => {

    let response;
    beforeEach(() => {
        response = {
            data: [
                {
                    "id": 1,
                    "name": "Leanne Graham",
                },
                {
                    "id": 2,
                    "name": "Ervin Howell",
                },
                {
                    "id": 3,
                    "name": "Clementine Bauch",
                },
            ]
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('renders learn react link', async () => {
        mockAxios.get.mockReturnValue(response);
        render(<MemoryRouter>
            <AppRouter/>
            <Users/>
        </MemoryRouter>); // передается компонент для рендеринга
        const users = await screen.findAllByTestId('user-item');
        expect(users.length).toBe(3);
        expect(mockAxios.get).toBeCalledTimes(1);
        screen.debug();
    });

    test('redirect to detail page', async () => {
        mockAxios.get.mockReturnValue(response);
        render(renderWithRouter(null, '/users')); // передается компонент для рендеринга
        const users = await screen.findAllByTestId('user-item');
        console.log(users)
        expect(users.length).toBe(3);
        await userEvent.click(users[0]);
        expect(screen.getByTestId("user-page")).toBeInTheDocument();
    });

})

