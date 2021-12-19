export default {
    find: {
        static: true,
        method: 'get',
        remote: '/',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            },
            {
                arg: 'include',
                type: 'array',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'read'
    },
    create: {
        static: true,
        method: 'post',
        remote: '/',
        accepts: [
            {
                arg: 'data',
                require: true,
                type: 'object',
                isCurrentModelSchema: true,
                http: {
                    source: 'body'
                }
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'body'
                }
            }
        ],
        group: 'write'
    },
    count: {
        static: true,
        method: 'get',
        remote: '/count',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        prepare: (count) => ({ count }),
        group: 'read'
    },
    exists: {
        static: true,
        method: 'get',
        remote: '/exists',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        prepare: (exists) => ({ exists }),
        group: 'read'
    },
    deleteOne: {
        static: true,
        method: 'post',
        remote: '/deleteOne',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'delete'
    },
    deleteMany: {
        static: true,
        method: 'post',
        remote: '/deleteMany',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'delete'
    },
    findById: {
        static: true,
        method: 'get',
        remote: '/:id',
        accepts: [
            {
                arg: 'id',
                type: 'string',
                http: {
                    source: 'params'
                },
                required: true
            }, {
                arg: 'include',
                type: 'array',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'read'
    },
    findByIdAndUpdate: {
        static: true,
        method: 'put',
        remote: '/:id',
        accepts: [
            {
                arg: 'id',
                type: 'string',
                http: {
                    source: 'params'
                },
                required: true
            }, {
                arg: 'data',
                type: 'object',
                isCurrentModelSchema: true,
                http: {
                    source: 'body'
                },
                required: true
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'write'
    },
    findByIdAndDelete: {
        static: true,
        method: 'delete',
        remote: '/:id',
        accepts: [
            {
                arg: 'id',
                type: 'string',
                http: {
                    source: 'params'
                },
                required: true
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'delete'
    },
    findOne: {
        static: true,
        method: 'get',
        remote: '/findOne',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }, {
                arg: 'include',
                type: 'array',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'read'
    },
    findOneAndDelete: {
        static: true,
        method: 'post',
        remote: '/findOneAndDelete',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'delete'
    },
    findOneAndUpdate: {
        static: true,
        method: 'post',
        remote: '/findOneAndUpdate',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }, {
                arg: 'data',
                type: 'object',
                isCurrentModelSchema: true,
                http: {
                    source: 'body'
                },
                required: true
            }, {
                arg: 'options',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'write'
    },
    findOneAndReplace: {
        static: true,
        method: 'post',
        remote: '/findOneAndReplace',
        accepts: [
            {
                arg: 'filter',
                type: 'object',
                http: {
                    source: 'query'
                }
            }, {
                arg: 'data',
                type: 'object',
                isCurrentModelSchema: true,
                http: {
                    source: 'body'
                },
                required: true
            }, {
                arg: 'options',
                type: 'object',
                http: {
                    source: 'query'
                }
            }
        ],
        group: 'write'
    }
};
