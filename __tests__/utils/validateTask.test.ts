import { validateTaskTitle } from '../../src/utils/validateTask';

describe('validateTaskTitle', () => {
  describe('cuando el título es válido', () => {
    it('retorna null para un título con longitud válida', () => {
      expect(validateTaskTitle('Comprar leche')).toBeNull();
    });

    it('retorna null para un título con exactamente 3 caracteres', () => {
      expect(validateTaskTitle('Abc')).toBeNull();
    });

    it('retorna null para un título con exactamente 100 caracteres', () => {
      const titulo100 = 'A'.repeat(100);
      expect(validateTaskTitle(titulo100)).toBeNull();
    });

    it('el resultado para un título válido es igual a null (toEqual)', () => {
      expect(validateTaskTitle('Comprar pan')).toEqual(null);
    });
  });

  describe('cuando el título es inválido', () => {
    it('retorna mensaje de error para un string vacío', () => {
      expect(validateTaskTitle('')).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un string con solo espacios', () => {
      expect(validateTaskTitle('   ')).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un título con menos de 3 caracteres', () => {
      expect(validateTaskTitle('Ab')).toBe('El título debe tener al menos 3 caracteres');
    });

    it('retorna mensaje de error para un título con más de 100 caracteres', () => {
      const titulo101 = 'A'.repeat(101);
      expect(validateTaskTitle(titulo101)).toBe('El título no puede exceder los 100 caracteres');
    });

    it('el mensaje de error para título corto menciona la longitud mínima', () => {
      expect(validateTaskTitle('Ab')).toContain('3 caracteres');
    });

    it('retorna mensaje de error para un título undefined', () => {
      // @ts-expect-error probando un valor inesperado en runtime (el formulario podría no inicializar el campo)
      expect(validateTaskTitle(undefined)).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un título null', () => {
      // @ts-expect-error probando un valor inesperado en runtime
      expect(validateTaskTitle(null)).toBe('El título es obligatorio');
    });
  });

  describe('con caracteres especiales', () => {
    it('acepta un título con emojis y caracteres Unicode si respeta la longitud', () => {
      expect(validateTaskTitle('Comprar 🥛 y pan')).toBeNull();
    });
  });
});
