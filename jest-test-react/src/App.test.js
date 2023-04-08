import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

`***
FindBy - пытается найти один элемент. Возвращает объект завернутый в промис findAll - пытается найти массив элементов
getBy - должен 100% найти, если не найдет то будет ошибка. Возвращает объект getAll - то же самое
queryBy/queryAll - Убеждаемся что какого то элемента нет
***`

describe('TEST app', () => {
  test('renders learn react link', () => {
    render(<App />); // передается компонент для рендеринга
    const helloWorld = screen.getByText(/hello world/i);
    const btn = screen.getByRole('button');
    const input = screen.getByPlaceholderText(/input value/i);
    expect(helloWorld).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(input).toMatchSnapshot(); //Снэпшоты, создают папку с файлами
  });

  test('renders learn react link', async () => {
    render(<App />); // передается компонент для рендеринга
    // const helloWorldElem = screen.queryByText(/hello2/i)
    // expect(helloWorldElem).toBeNull()
    const helloWorldElem = await screen.findByText(/data/i)
    expect(helloWorldElem).toBeInTheDocument();
    expect(helloWorldElem).toHaveStyle({color: 'red'});
  });

  test('click event', () => {
    render(<App />);
    const btn = screen.getByTestId('toggle-btn');
    expect(screen.queryByTestId('toggle-elem')).toBeNull();
    fireEvent.click(btn)
    expect(screen.queryByTestId('toggle-elem')).toBeInTheDocument();
    fireEvent.click(btn)
    expect(screen.queryByTestId('toggle-elem')).toBeNull();
  });

  test('input event', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/input value/i);
    expect(screen.queryByTestId('value-elem')).toContainHTML('');
    // искусственное событие
    fireEvent.input(input, {
      target: {value: '123123'}
    })

    // эмулирует пользователя
    // userEvent.type(input, '123123')
    expect(screen.queryByTestId('value-elem')).toContainHTML('123123');
    // проверяется классическое поведение пользователя
  });

})

