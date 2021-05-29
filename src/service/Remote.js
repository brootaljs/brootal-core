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
        ]
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
        ]
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
        prepare: (count) => ({count})
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
        prepare: (exists) => ({exists})
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
    }
}