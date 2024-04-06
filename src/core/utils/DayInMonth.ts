export const daysInMonth  = function() {
    let date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const response = 32 - new Date(year, month, 32).getDate();
    let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
    console.log(dayWeek);

    return response
}
