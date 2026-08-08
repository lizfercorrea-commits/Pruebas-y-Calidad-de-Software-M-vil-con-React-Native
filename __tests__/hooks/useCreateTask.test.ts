import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import { createTask, fetchTasks } from '../../src/services/taskService';

// jest.mock(): useCreateTask depende de taskService, que representa la llamada
// a la API real. La aislamos para que la prueba sea rápida y determinística,
// y para poder forzar tanto el camino feliz como el de error sin depender de
// una API real disponible.
jest.mock('../../src/services/taskService', () => ({
  createTask: jest.fn(),
  // fetchTasks resuelve vacío por defecto: estas pruebas son de Actividad 2
  // y no les interesa la carga inicial desde la API (eso se prueba en
  // integración, en __tests__/integration/CreateTaskScreen.test.tsx).
  fetchTasks: jest.fn().mockResolvedValue([]),
}));

const mockCreateTask = createTask as jest.Mock;
const mockFetchTasks = fetchTasks as jest.Mock;

describe('useCreateTask', () => {
  beforeEach(() => {
    mockCreateTask.mockClear();
    mockFetchTasks.mockClear();
    mockFetchTasks.mockResolvedValue([]);
  });

  it('inicia en estado "idle" y sin tareas', async () => {
    const { result } = await renderHook(() => useCreateTask());
    expect(result.current.status).toBe('idle');
    expect(result.current.tasks).toEqual([]);
  });

  it('termina en estado "success" y guarda la tarea creada al llamar submit', async () => {
    mockCreateTask.mockResolvedValue({ id: '1', title: 'Nueva tarea', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Nueva tarea');
    });

    expect(result.current.status).toBe('success');
    expect(result.current.tasks[0].title).toBe('Nueva tarea');
    expect(mockCreateTask).toHaveBeenCalledWith('Nueva tarea');
  });

  it('agrega la tarea nueva al inicio de la lista, conservando las anteriores', async () => {
    mockCreateTask
      .mockResolvedValueOnce({ id: '1', title: 'Primera', status: 'pending' })
      .mockResolvedValueOnce({ id: '2', title: 'Segunda', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Primera');
    });
    await act(async () => {
      await result.current.submit('Segunda');
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].title).toBe('Segunda');
    expect(result.current.tasks.map((t) => t.title)).toContain('Primera');
  });

  it('pasa a estado "error" cuando el servicio falla', async () => {
    mockCreateTask.mockRejectedValue(new Error('Falló la creación'));
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea que falla');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.tasks).toEqual([]);
  });

  it('elimina una tarea existente por id', async () => {
    mockCreateTask.mockResolvedValue({ id: '1', title: 'Tarea a borrar', status: 'pending' });
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea a borrar');
    });
    expect(result.current.tasks).toHaveLength(1);

    await act(() => {
      result.current.removeTask('1');
    });
    expect(result.current.tasks).toEqual([]);
  });
});
