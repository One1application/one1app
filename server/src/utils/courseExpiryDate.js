import moment from "moment";
export const calculateExpiryDate = (validityType, startDate = new Date()) => {
    const date = moment(startDate);

    switch(validityType){
        case 'Weekly': 
            return date.add(1, 'week').toDate();
        case 'Monthly':
            return date.add(1, 'month').toDate();
        case 'HalfYearly':
            return date.add(6, 'months').toDate();
        case 'Yearly':
            return date.add(1, 'year').toDate();
        case 'LifeTime':
            return null;            

        default:
            throw new error("Invalid course validityType");
          
    }
}