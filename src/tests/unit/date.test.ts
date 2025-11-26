import {
  formatShortDate,
  formatFullDate,
  formatDateTime,
  formatRelativeDate,
  isDatePast,
  isDateFuture,
  getDaysDifference,
  isOverdue,
} from "@/shared/util/date";

describe("Date Utilities", () => {
  const now = new Date("2024-01-15T12:00:00Z");
  const pastDate = new Date("2024-01-10T12:00:00Z");
  const futureDate = new Date("2024-01-20T12:00:00Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("formatShortDate", () => {
    it("deve formatar data corretamente", () => {
      const result = formatShortDate("2024-01-15T12:00:00Z");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("deve aceitar Date object", () => {
      const date = new Date("2024-01-15");
      const result = formatShortDate(date);
      expect(result).toBeTruthy();
    });
  });

  describe("formatFullDate", () => {
    it("deve formatar data completa corretamente", () => {
      const result = formatFullDate("2024-01-15T12:00:00Z");
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  describe("formatDateTime", () => {
    it("deve formatar data com hora corretamente", () => {
      const result = formatDateTime("2024-01-15T14:30:00Z");
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });
  });

  describe("formatRelativeDate", () => {
    it("deve retornar distância relativa correta", () => {
      const result = formatRelativeDate(pastDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("isDatePast", () => {
    it("deve retornar true para data no passado", () => {
      expect(isDatePast(pastDate)).toBe(true);
    });

    it("deve retornar false para data no futuro", () => {
      expect(isDatePast(futureDate)).toBe(false);
    });

    it("deve aceitar string", () => {
      expect(isDatePast("2024-01-10T12:00:00Z")).toBe(true);
    });
  });

  describe("isDateFuture", () => {
    it("deve retornar true para data no futuro", () => {
      expect(isDateFuture(futureDate)).toBe(true);
    });

    it("deve retornar false para data no passado", () => {
      expect(isDateFuture(pastDate)).toBe(false);
    });
  });

  describe("getDaysDifference", () => {
    it("deve calcular diferença de dias corretamente", () => {
      const date1 = new Date("2024-01-20");
      const date2 = new Date("2024-01-15");
      const diff = getDaysDifference(date1, date2);
      expect(diff).toBe(5);
    });

    it("deve aceitar strings", () => {
      const diff = getDaysDifference("2024-01-20", "2024-01-15");
      expect(diff).toBe(5);
    });
  });

  describe("isOverdue", () => {
    it("deve retornar true para tarefa atrasada não concluída", () => {
      expect(isOverdue(pastDate, false)).toBe(true);
    });

    it("deve retornar false para tarefa atrasada mas concluída", () => {
      expect(isOverdue(pastDate, true)).toBe(false);
    });

    it("deve retornar false para tarefa futura", () => {
      expect(isOverdue(futureDate, false)).toBe(false);
    });

    it("deve retornar false quando date é null", () => {
      expect(isOverdue(null, false)).toBe(false);
    });
  });
});

