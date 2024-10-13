function calculateTotalTarget(startDate, endDate, totalAnnualTarget, excludeDay = 'Friday') {
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const excludeDayIndex = daysInWeek.indexOf(excludeDay);
    
    // Function to determine if a date is a working day
    function isWorkingDay(date) {
        return date.getDay() !== excludeDayIndex; // Exclude specified day
    }

    // Helper function to get the number of working days in a month
    function getWorkingDaysInMonth(year, month) {
        const date = new Date(year, month, 1);
        const workingDays = [];
        
        while (date.getMonth() === month) {
            if (isWorkingDay(date)) {
                workingDays.push(new Date(date));
            }
            date.setDate(date.getDate() + 1);
        }
        return workingDays.length;
    }

    // Parse input dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];

    let totalWorkingDays = 0;

    // Loop through each month in the range
    for (let year = startYear; year <= endYear; year++) {
        const startMonth = year === startYear ? start.getMonth() : 0;
        const endMonth = year === endYear ? end.getMonth() : 11;

        for (let month = startMonth; month <= endMonth; month++) {
            const workingDaysInMonth = getWorkingDaysInMonth(year, month);

            // Count actual days worked (valid range)
            const monthStartDate = new Date(year, month, 1);
            const monthEndDate = new Date(year, month + 1, 0); // Last day of the month
            const totalDaysWorked = [];

            for (let d = monthStartDate; d <= monthEndDate; d.setDate(d.getDate() + 1)) {
                if (isWorkingDay(d) && d >= start && d <= end) {
                    totalDaysWorked.push(new Date(d));
                }
            }

            daysExcludingFridays.push(workingDaysInMonth);
            daysWorkedExcludingFridays.push(totalDaysWorked.length);
            totalWorkingDays += totalDaysWorked.length;

            // Calculate monthly target if there are working days
            const monthlyTarget = workingDaysInMonth > 0 ? (totalAnnualTarget / totalWorkingDays) * totalDaysWorked.length : 0;
            monthlyTargets.push(monthlyTarget);
        }
    }

    const totalTarget = monthlyTargets.reduce((sum, target) => sum + target, 0);

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget,
    };
}

// Example usage:
const result = calculateTotalTarget('2024-01-01', '2024-04-31', 450);
console.log(result);
