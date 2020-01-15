function calculateIntakeEndDate(intakes, stock, frequency, weekDays) {
    const config = {
            dayStep: 1
        },
        currentIntakeTime = new Date(),
        today = new Date();

    let lastIntakeDate;

    if (frequency === 'weekly') {
        config.weekDaysToNum = weekDaysToNum (weekDays);
    } else if (frequency === 'daily') {
        config.dayStep = 1;
    } else if (frequency === 'eachOtherDay') {
        config.dayStep = 2;
    }

    while (stock > 0) {

        if ( isDayToIntakePills(currentIntakeTime, frequency, config.weekDaysToNum) ) {
            intakes.forEach( intake => {
                if (stock > 0) {
                    const hours = Number(intake.time.split(':')[0]),
                        min = Number(intake.time.split(':')[1]);

                    currentIntakeTime.setHours(hours);
                    currentIntakeTime.setMinutes(min);
                    currentIntakeTime.setSeconds(0);

                    if (currentIntakeTime > today) {

                        stock -= intake.pills;
                        if ( stock <= 0) {
                            lastIntakeDate = new Date(currentIntakeTime);
                        }
                    }
                }
            });
        }


        currentIntakeTime.setDate(currentIntakeTime.getDate() + config.dayStep);
        currentIntakeTime.setHours(0);
        currentIntakeTime.setMinutes(0);
        currentIntakeTime.setSeconds(0);
    }

    return lastIntakeDate || 'no pills';

    function isDayToIntakePills(date, frequency, weekDays) {

        if (frequency === 'weekly') {
            return weekDays.includes(date.getDay());
        } else {
            return true;
        }
    }
    function weekDaysToNum(weekDays) {

        const weekDaysDate = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 0,
        },
            intakeDays = [];

        for (let day in weekDays) {
            if (weekDays.hasOwnProperty(day)) {
                if (weekDays[day]) {
                    intakeDays.push(weekDaysDate[day]);
                }
            }
        }

        return intakeDays;
    }

}