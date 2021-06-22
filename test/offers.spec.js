'use strict';

const { expect } = require('chai');
const { stub, assert } = require('sinon');

const offersHandler = require('../src/routes/offers');

describe('offers route', () => {
    const hits = [];
    const response = {
        body: { hits }
    };
    const searchStub = stub().returns(response);
    const elastic = { search: searchStub };
    const { handler } = offersHandler(elastic);

    beforeEach(() => {
        searchStub.resetHistory();
    });

    it('should call elasticsearch with proper query and default sort', async () => {
        const req = {
            query: {
                certificates: 'adx',
                paidLeave: true,
                salaryFrom: 200,
                salaryTo: 2000,
                skills: 'some_skills',
                workArea: 'area',
            }
        }
        const response = await handler(req);
        expect(response).to.eql(hits);
        assert.calledOnceWithExactly(searchStub, {
            index: 'offers',
            body: { 
                sort: [{ _score: { order: 'desc' }}],
                query: { 
                    bool: { 
                        must: [
                            { match: { 'certificates.pl': 'adx' } },
                            { term: { paidLeave: true } },
                            { range: { salaryFrom: { gte: 200 } } },
                            { range: { salaryTo: { lte: 2000 } } },
                            { match: { 'requirements.skills.pl': 'some_skills' } },
                            { match: { 'requirements.workArea.pl': 'area' } },
                        ],
                    },
                },
            },
        });
    });

    it('should call elasticsearch with custom sort', async () => {
        const req = {
            query: {
                sortBy: 'salaryFrom',
                sortOrder: 'asc',
            }
        }
        const response = await handler(req);
        expect(response).to.eql(hits);
        assert.calledOnceWithExactly(searchStub, {
            index: 'offers',
            body: { 
                sort: [{ salaryFrom: { order: 'asc' }}],
            },
        });
    });

    it('should call elasticsearch with custom sort (recruitmentStages.duration)', async () => {
        const req = {
            query: {
                sortBy: 'recruitmentStages.duration',
                sortOrder: 'asc',
            }
        }
        const response = await handler(req);
        expect(response).to.eql(hits);
        assert.calledOnceWithExactly(searchStub, {
            index: 'offers',
            body: { 
                sort: [{ 'recruitmentStages.duration': { order: 'asc', mode: 'sum' }}],
            },
        });
    });

    it('should ignore additional fields', async () => {
        const req = {
            query: {
                certificates: 'adx',
                paidLeave: true,
                foo: 'bar',
                ignoreMe: true,
            }
        }
        const response = await handler(req);
        expect(response).to.eql(hits);
        assert.calledOnceWithExactly(searchStub, {
            index: 'offers',
            body: { 
                sort: [ { _score: { order: 'desc' } } ],
                query: { 
                    bool: { 
                        must: [
                            { match: { 'certificates.pl': 'adx' } },
                            { term: { paidLeave: true } },
                        ],
                    },
                },
            },
        });
    })
});


