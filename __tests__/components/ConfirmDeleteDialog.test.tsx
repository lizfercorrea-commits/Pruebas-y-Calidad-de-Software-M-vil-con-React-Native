import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

const noop = () => {};

describe('ConfirmDeleteDialog', () => {
  it('muestra el texto "Eliminar tarea" cuando el diálogo está visible', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={noop} onCancel={noop} />
    );
    expect(screen.getByText('Eliminar tarea')).toBeTruthy();
  });

  it('muestra el texto "¿Seguro que quieres eliminar `Cocinar`?" cuando el diálogo está visible', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Cocinar" onConfirm={noop} onCancel={noop} />
    );
    expect(screen.getByText(`¿Seguro que quieres eliminar "Cocinar"? Esta acción no se puede deshacer.`)).toBeTruthy();
  });

  it('llama a onConfirm al presionar "Eliminar"', async () => {
    // jest.fn(): aislamos onConfirm porque este diálogo no debe ejecutar la
    // eliminación real; solo nos interesa confirmar que el botón dispara el
    // callback correcto.
    const onConfirm = jest.fn();
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={onConfirm} onCancel={noop} />
    );
    await fireEvent.press(screen.getByLabelText('Confirmar eliminación'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('llama a onCancel al presionar "Cancelar"', async () => {
    // jest.fn(): igual que con onConfirm, aislamos onCancel porque el diálogo
    // no ejecuta la lógica de cancelar; solo nos interesa que dispare el
    // callback correcto al presionar el botón.
    const onCancel = jest.fn();
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={noop} onCancel={onCancel} />
    );
    await fireEvent.press(screen.getByLabelText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('usa el texto genérico "esta tarea" cuando no se recibe taskTitle', async () => {
    await render(<ConfirmDeleteDialog visible onConfirm={noop} onCancel={noop} />);
    expect(
      screen.getByText('¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.')
    ).toBeTruthy();
  });
});
