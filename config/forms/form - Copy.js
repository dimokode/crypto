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
    symbol1 : {
        element : 'input',
        label : 'symbol1',
        attributes : {
            id : 'symbol1',
            name : 'symbol1',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',
        },
        db : {
            db_table : 'scalp',
            db_field : 'symbol1',
            db_type : 'varchar(255)'
        },
        parent : {
            class : 'inline'
        }

    },
    qty1 : {
        element : 'input',
        label : 'qty1',
        attributes : {
            id : 'qty1',
            name : 'qty1',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',

        },
        db : {
            db_table : 'scalp',
            db_field : 'qty1',
            db_type : 'real'
        },
        parent : {
            class : 'inline'
        }
    },

    symbol2 : {
        element : 'input',
        label : 'symbol2',
        attributes : {
            id : 'symbol2',
            name : 'symbol2',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',
        },
        db : {
            db_table : 'scalp',
            db_field : 'symbol2',
            db_type : 'varchar(255)'
        },
        parent : {
            class : 'inline'
        }
    },
    qty2 : {
        element : 'input',
        label : 'qty2',
        attributes : {
            id : 'qty2',
            name : 'qty2',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',

        },
        db : {
            db_table : 'scalp',
            db_field : 'qty2',
            db_type : 'real'
        },
        parent : {
            class : 'inline'
        }
    },


    priceOpen : {
        element : 'input',
        label : 'priceOpen',
        attributes : {
            id : 'priceOpen',
            name : 'priceOpen',
            type : 'text',
            size: 10,
            value : '',
            validation : 'isNotEmpty()',

        },
        db : {
            db_table : 'scalp',
            db_field : 'priceOpen',
            db_type : 'real'
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