import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';
import { TaskCard } from '../../src/components/TaskCard';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

// Pruebas de Actividad 3: usan matchers propios de @testing-library/jest-native
// (toHaveProp, toBeOnTheScreen) en vez de solo comprobar el texto visible,
// para verificar directamente las propiedades de accesibilidad que consumen
// VoiceOver/TalkBack (accessibilityRole, accessibilityLabel).
describe('Propiedades accesibles con jest-native', () => {
  it('el botón "Guardar" de TaskForm expone accessibilityRole "button"', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const boton = screen.getByText('Guardar').parent;
    expect(boton).toHaveProp('accessibilityRole', 'button');
  });

  it('el campo de título de TaskForm expone un accessibilityLabel explícito, no solo el placeholder', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);
    const input = screen.getByTestId('input-titulo');
    expect(input).toHaveProp('accessibilityLabel', 'Título de la tarea');
  });

  it('el botón "Eliminar" de TaskCard tiene su propio accessibilityLabel, independiente del texto visible', async () => {
    const task = { id: '1', title: 'Repasar accesibilidad', status: 'pending' as const };
    await render(<TaskCard task={task} onDelete={jest.fn()} />);
    const eliminar = screen.getByText('Eliminar').parent;
    expect(eliminar).toHaveProp('accessibilityLabel', 'Eliminar tarea Repasar accesibilidad');
  });

  it('los botones "Confirmar eliminación" y "Cancelar" están presentes en pantalla mientras el diálogo es visible', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Repasar" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByLabelText('Confirmar eliminación')).toBeOnTheScreen();
    expect(screen.getByLabelText('Cancelar')).toBeOnTheScreen();
  });
});
