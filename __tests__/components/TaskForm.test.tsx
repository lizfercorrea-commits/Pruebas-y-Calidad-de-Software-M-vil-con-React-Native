import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {
  it('llama a onSubmit con el título ingresado al presionar "Guardar"', async () => {
    // jest.fn(): TaskForm no debe saber qué pasa después de enviar el título
    // (guardarlo, mandarlo a una API, etc.); a la prueba solo le interesa
    // confirmar que el componente invoca onSubmit con el valor correcto.
    const mockOnSubmit = jest.fn();
    await render(<TaskForm onSubmit={mockOnSubmit} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Mi nueva tarea'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Mi nueva tarea');
  });

  it('no llama a onSubmit si el campo está vacío', async () => {
    const mockOnSubmit = jest.fn();
    await render(<TaskForm onSubmit={mockOnSubmit} />);

    await fireEvent.press(screen.getByText('Guardar'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('refleja en el input (consultado por testID) el texto que escribe el usuario', async () => {
    const mockOnSubmit = jest.fn();
    await render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId('input-titulo');
    await fireEvent.changeText(input, 'Comprar pan');

    expect(input.props.value).toBe('Comprar pan');
  });

  it('permite enviar el formulario presionando el botón consultado por rol "button"', async () => {
    const mockOnSubmit = jest.fn();
    await render(<TaskForm onSubmit={mockOnSubmit} />);

    await fireEvent.changeText(screen.getByTestId('input-titulo'), 'Tarea por rol');
    await fireEvent.press(screen.getByRole('button'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Tarea por rol');
  });
});
