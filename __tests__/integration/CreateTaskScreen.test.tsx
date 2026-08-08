import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';
import { server } from '../../src/mocks/server';

const API_URL = 'https://api.taskmanager.com';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

describe('CreateTaskScreen - Integración', () => {
  it('crea una tarea exitosamente: formulario, hook y API real de MSW articulados en un solo flujo', async () => {
    // Usa los handlers por defecto de src/mocks/handlers.ts (POST /tasks -> 201).
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });
    expect(screen.getByText('Estudiar pruebas de integración')).toBeTruthy();
  });

  it('muestra un error cuando la API responde con un fallo al crear la tarea', async () => {
    // server.use(): sobreescribe solo para esta prueba el handler de POST /tasks
    // para simular una respuesta 500, sin tocar el handler por defecto ni
    // depender de un backend real que realmente falle.
    server.use(
      http.post(`${API_URL}/tasks`, () => {
        return HttpResponse.json({ message: 'Error interno' }, { status: 500 });
      })
    );

    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea que va a fallar'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Error al crear la tarea')).toBeTruthy();
    });
    expect(screen.queryByText('Tarea que va a fallar')).toBeNull();
  });

  it('muestra el estado de lista vacía cuando la API responde sin tareas al cargar la pantalla', async () => {
    // server.use(): sobreescribe el GET /tasks (carga inicial) para devolver
    // un arreglo vacío, comprobando que la pantalla refleja una respuesta
    // "datos vacíos" real de la API y no solo el estado inicial local del hook.
    server.use(
      http.get(`${API_URL}/tasks`, () => {
        return HttpResponse.json([]);
      })
    );

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('No hay tareas aún')).toBeTruthy();
    });
  });
});
