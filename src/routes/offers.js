'use strict';

const bodybuilder = require('bodybuilder');

const offersHandler = (elastic) => ({
    async handler(req) {
        const { query } = req;

        const { 
            certificates,
            paidLeave,
            salaryFrom,
            salaryTo,
            skills,
            workArea,
            sortBy = '_score',
            sortOrder = 'desc',
        } = query;

        const builder = bodybuilder();

        if (certificates) builder.query('match', 'certificates.pl', certificates);
        if (paidLeave) builder.query('term', 'paidLeave', paidLeave);
        if (salaryFrom) builder.query('range', 'salaryFrom', { gte: salaryFrom });
        if (salaryTo) builder.query('range', 'salaryTo', { lte: salaryTo });
        if (skills) builder.query('match', 'requirements.skills.pl', skills);
        if (workArea) builder.query('match', 'requirements.workArea.pl', workArea);

        if (sortBy === 'recruitmentStages.duration') builder.sort(sortBy, { order: sortOrder, mode: 'sum' });
        else builder.sort(sortBy, sortOrder);

        const body = builder.build();

        const result = await elastic.search({
            index: 'offers', 
            body,
        });

        return result.body.hits;
    }
});

module.exports = offersHandler;
