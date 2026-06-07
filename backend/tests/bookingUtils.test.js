const {
    validateBookingInput,
    isBookingDateValid,
    canCancelBooking,
} = require("../utils/bookingUtils");

describe("bookingUtils unit tests", ()=>{
    test("validateBookingInput returns true for complete booking data", () =>{
        const result = validateBookingInput({
            date: "2026-12-31",
            time: "10:00-11:00",
            court: "Basketball Court",
        });

        expect(result).toBe(true);
    });

    test("validateBookingInput returns false when data is missing", ()=>{
        const result = validateBookingInput({
            time: "10:00-11:00",
            court: "Basketball Court",
        });

        expect(result).toBe(false);
    });

    test("isBookingDateValid returns true for a future date", ()=>{
        const result = isBookingDateValid("2099-12-31");

        expect(result).toBe(true);
    });

    test("canCancelBooking returns true when user owns the booking", ()=>{
        const booking = {
            userId: "user123",
        };

        const user = {
            userId: "user123",
            role: "user",
        };

        const result = canCancelBooking(booking, user);
        expect(result).toBe(true);
    });

    test("canCancelBooking returns true when user is admin", ()=>{
        const booking = {
            userId: "user123",
        };

        const user = {
            userId: "andmin999",
            role: "admin",
        };

        const result = canCancelBooking(booking, user);

        expect(result).toBe(true);
    });

    test("canCancelBooking returns false when user is not owner or admin", ()=>{
        const booking = {
            userId: "user123",
        };

        const user = {
            userId: "user234",
            role: "user",
        }

        const result = canCancelBooking(booking, user);

        expect(result).toBe(false);
    });
});