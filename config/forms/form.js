export let obj = {
    id : {
        element : 'input',
        label : 'ID',
        attributes : {
            id : 'id',
            name : 'id',
            type : 'number',
            value : '',

        },
        db : {
            db_table : 'scalp',
            db_field : 'id',
            db_field_unique : 'PRIMARY KEY AUTOINCREMENT NOT NULL',
            db_type : 'integer'
        }
    },
    timestamp : {
        element : 'input',
        label : 'timestamp',
        attributes : {
            id : 'timestamp',
            name : 'timestamp',
            type : 'text',
            value : Date.now(),

        },
        db : {
            db_table : 'scalp',
            db_field : 'timestamp',
            db_type : 'varchar(255)'
        }
    },

    symbol : {
        element : 'input',
        label : 'symbol',
        attributes : {
            id : 'symbol',
            name : 'symbol',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',
            disabled : true
        },
        db : {
            db_table : 'scalp',
            db_field : 'symbol',
            db_type : 'varchar(255)'
        },
        parent : {
            class : 'inline'
        }

    },
    qty : {
        element : 'input',
        label : 'qty',
        attributes : {
            id : 'qty',
            name : 'qty',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',
            disabled : true

        },
        db : {
            db_table : 'scalp',
            db_field : 'qty',
            db_type : 'real'
        },
        parent : {
            class : 'inline'
        }
    },

    quoteQty : {
        element : 'input',
        label : 'quoteQty',
        attributes : {
            id : 'quoteQty',
            name : 'quoteQty',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',
            disabled : true
        },
        db : {
            db_table : 'scalp',
            db_field : 'quoteQty',
            db_type : 'varchar(255)'
        },
        parent : {
            class : 'inline'
        }
    },


    price : {
        element : 'input',
        label : 'price',
        attributes : {
            id : 'price',
            name : 'price',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',
            disabled : true

        },
        db : {
            db_table : 'scalp',
            db_field : 'price',
            db_type : 'real'
        },
        parent : {
            class : 'inline'
        }
    },


    priceClose : {
        element : 'input',
        label : 'priceClose',
        attributes : {
            id : 'priceClose',
            name : 'priceClose',
            type : 'text',
            size: 10,
            value : '',
            //validation : 'isNotEmpty()',

        },
        db : {
            db_table : 'scalp',
            db_field : 'priceClose',
            db_type : 'real'
        },
        parent : {
            class : 'inline'
        }
    },


    dealType : {
        element : 'select',
        label : 'dealType',
        attributes : {
            id: 'dealType',
            name : 'dealType',
        },
        options : {
            0 : {
                text : 'long',
                attributes : {
                    value : 'long'
                }
            },
            1 : {
                text : 'short',
                attributes : {
                    value : 'short'
                }
            }
        },
        db : {
            db_table : 'scalp',
            db_field : 'dealType',
            db_type : 'varchar(255)'
        }
    },

    status : {
        element : 'select',
        label : 'status',
        attributes : {
            id: 'status',
            name : 'status',
        },
        options : {
            0 : {
                text : 'open',
                attributes : {
                    value : 'open'
                }
            },
            1 : {
                text : 'close',
                attributes : {
                    value : 'close'
                }
            }
        },
        db : {
            db_table : 'scalp',
            db_field : 'status',
            db_type : 'varchar(255)'
        }
    },

    submit : {
        element : 'button',
        attributes : {
            id : 'submit',
            name : 'submit',
            type : 'text',
            class : 'w3-button w3-green',
            value : 'Submit',
            onclick : 'forma.submitForm(); return false;'
        },
        parent : {
            class : 'inline'
        }
    },
}