function validateBookingInput({date, time, court}){
    return Boolean(date && time && court);
}

function isBookingDateValid(date){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    return selected > today;
}

function canCancelBooking(booking, user){
    const isOwner = booking.userId === user.userId;
    const isAdmin = user.role === "admin";

    return isOwner || isAdmin;
}

module.exports = {
    validateBookingInput,
    isBookingDateValid, 
    canCancelBooking,
};