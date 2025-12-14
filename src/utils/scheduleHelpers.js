export function convertToIntervals(startTimes) {
    if (!startTimes || startTimes.length === 0) return [];

    // Sort times to ensure correct order
    const sorted = [...startTimes].sort();

    const intervals = [];
    let intervalStart = sorted[0];
    let lastTime = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const [lastHour, lastMin] = lastTime.split(':').map(Number);
        const [currHour, currMin] = current.split(':').map(Number);

        // Check if current time is exactly 1 hour after last time
        const isConsecutive = (currHour === lastHour + 1 && currMin === lastMin);

        if (!isConsecutive) {
            // End the current interval and start a new one
            const [startHour, startMin] = intervalStart.split(':').map(Number);
            const endHour = lastHour + 1;
            const endTime = `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;

            intervals.push({ start: intervalStart, end: endTime });
            intervalStart = current;
        }

        lastTime = current;
    }

    // Add the final interval
    const [startHour, startMin] = intervalStart.split(':').map(Number);
    const [lastHour, lastMin] = lastTime.split(':').map(Number);
    const endHour = lastHour + 1;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;

    intervals.push({ start: intervalStart, end: endTime });

    return intervals;
}