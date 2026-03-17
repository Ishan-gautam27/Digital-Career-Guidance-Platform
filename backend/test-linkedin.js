const linkedIn = require('linkedin-jobs-api');

const queryOptions = {
    keyword: 'developer',
    location: 'India',
    dateSinceLast: 'pastWeek', // pastMonth, pastWeek, past24Hours
    sortMode: 'relevance', // relevance, desc
    limit: '20'
};

linkedIn.query(queryOptions).then(response => {
    console.log(JSON.stringify(response, null, 2));
}).catch(err => {
    console.error("Error fetching jobs:", err);
});
