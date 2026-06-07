import { describe, expect, test } from "vitest";

import {
  countByField,
  countByMonth,
  countByWeekday,
  getTopLabel,
} from "./dashboardUtils";

describe("dashboardUtils unit tests", () => {
  test("countByField counts items by a selected field", () => {
    const bookings = [
      { court: "Basketball Court" },
      { court: "Basketball Court" },
      { court: "Badminton Court" },
    ];

    const result = countByField(bookings, "court");

    expect(result).toEqual({
      "Basketball Court": 2,
      "Badminton Court": 1,
    });
  });

  test("countByField ignores missing field values", () => {
    const bookings = [
      { court: "Basketball Court" },
      {},
      { court: "Badminton Court" },
    ];

    const result = countByField(bookings, "court");

    expect(result).toEqual({
      "Basketball Court": 1,
      "Badminton Court": 1,
    });
  });

  test("countByMonth counts bookings by year-month", () => {
    const bookings = [
      { date: "2026-05-29" },
      { date: "2026-05-30" },
      { date: "2026-06-01" },
    ];

    const result = countByMonth(bookings);

    expect(result).toEqual({
      "2026-05": 2,
      "2026-06": 1,
    });
  });

  test("countByWeekday counts bookings by weekday", () => {
    const bookings = [
        {date: "2026-05-29"}, // Friday
        {date: "2026-05-30"}, // Saturday
        {date: "2026-06-05"}, // Friday
    ];

    const result = countByWeekday(bookings);

    expect(result).toEqual({
        "Friday": 2,
        "Saturday": 1,
    });
  })

  test("getTopLabel returns the label with the highest court", () => {
    const data = {
      "Basketball Court": 3,
      "Badminton Court": 5,
      "Table Tennis Court": 8,
    };

    const result = getTopLabel(data);

    expect(result).toBe("Table Tennis Court");
  });

  test("getTopLable returns N/A for empty data", () => {
    const result = getTopLabel({});

    expect(result).toBe("N/A");
  });
});
