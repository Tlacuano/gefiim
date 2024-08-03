import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { requestToGenarateTokenDTO } from '../controller/dtos/request_to_generatte_token.dto';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { convertToBase64 } from '../../../utils/security/base64';
import logger from '../../../config/logs/logger';
import { MESSAGES } from '../../../utils/messages/response_messages';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const createToken = async (data : requestToGenarateTokenDTO ) =>{

    try {
        const docDefinition: TDocumentDefinitions = {
            content: [
                // CABECERA
                {
                    table: {
                        widths: [200, '*'],
                        body: [
                            [
                                { text: 'Registro de aspirante', style: 'title', border: [false, false, true] },
                                {
                                    rowSpan: 2,
                                    image: data.logo,
                                    fit: [90, 50],
                                    alignment: 'right'
                                }
                            ],
                            [
                                { text: 'No. de Solicitud: ' + data.token, border: [false, false, true], margin: [0, 3, 0, 0] },
                                ''
                            ]
                        ]
                    },
                    layout: {
                        defaultBorder: false
                    }
                },
                
                //CARRERAS Y FOTO
                {
                    columns: [
                        {
                            width: 380,
                            table: {
                                widths:[100,'*',],
                                body: [
                                    [
                                        {
                                            text: 'Primera opción ',
                                            style: { bold: true },
                                            margin: [0, 3, 0, 3],
                                        },
                                        {
                                            text: data.speciality_1,
                                            margin: [0, 3, 0, 3],
                                        }
                                    ],
                                    [
                                        {
                                            text: 'Segunda opción ',
                                            style: { bold: true },
                                            margin: [0, 3, 0, 3],
                                        },
                                        {
                                            text: data.speciality_2,
                                            margin: [0, 5, 0, 5],
                                        }
                                    ],
                                    [
                                        {
                                            text: 'Tercera opción ',
                                            style: { bold: true },
                                            margin: [0, 3, 0, 3],
                                        },
                                        {
                                            text: data.speciality_3,
                                            margin: [0, 3, 0, 3],
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            table: {
                                body: [
                                    [
                                        {
                                            text: 'FOTO',
                                            margin: [30, 45, 30, 45],
                                        }
                                    ]
                                ]
                            },
                            margin: [30, 0, 0, 0],
                        }
                    ],
                    margin: [0, 25, 0, 5],
                },
                
                
                // DATOS GENERALES
                {
                    text: 'Datos generales:',
                    style: 'subtitle',
                    margin: [0, 0, 0, 5],
                },
            
                {
                    table: {
                        body: [
                            [
                                {
                                   text: 'CURP: ',
                                   border:[false],
                                   margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.curp
                                },
                                {
                                    text: 'Correo elecronico',
                                    border:[false]
                                },
                                {
                                    text: data.email
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                {
                    table:{
                        widths:[50,'*','*','*',],
                        body: [
                            [
                                {
                                   text: 'Nombre: ',
                                   border:[false],
                                },
                                {
                                    text: data.name
                                },
                                {
                                    text: data.first_last_name
                                },
                                {
                                    text: data.second_last_name
                                }
                            ]
                        ]
                    },
                    margin: [-4, 5, 0, 0],
                },
                {
                    table: {
                        body: [
                            [
                                {
                                   text: 'Fecha de nacimiento: ',
                                   border:[false],
                                   margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.birthdate
                                },
                                {
                                    text: 'Sexo:',
                                    border:[false],
                                    margin: [30, 0, 0, 0],
                                },
                                {
                                    text: data.gender,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                
                
                // DIRECCION
                {
                    text: 'Datos de domicilio:',
                    style: 'subtitle',
                    margin: [0, 15, 0, 5],
                },
                
                {
                    table: {
                        body: [
                            [
                                {
                                    text: 'Código postal: ',
                                    border:[false],
                                    margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.candidate_postal_code
                                },
                                {
                                    text: 'Número celular:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.phone_number,
                                },
                                {
                                    text: 'Celular secundario:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.secondary_phone_number,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                {
                    table: {
                        widths:[50,'*',82,'*',],
                        body: [
                            [
                                {
                                    text: 'Estado:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_state
                                },
                                {
                                    text: 'Municipio:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_municipality
                                }
                            ],
                            [
                                {
                                    text: 'Colonia:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_neighborhood
                                },
                                {
                                    text: 'Calle y número:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_street_and_number
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
        
        
                // TUTOR
                {
                    text: 'Datos del tutor:',
                    style: 'subtitle',
                    margin: [0, 15, 0, 5],
                },
                
                {
                    table:{
                        widths:[50,'*','*','*',],
                        body: [
                            [
                                {
                                    text: 'Nombre: ',
                                    border:[false],
                                },
                                {
                                    text: data.tutor_name
                                },
                                {
                                    text: data.tutor_first_last_name
                                },
                                {
                                    text: data.tutor_second_last_name
                                }
                            ]
                        ]
                    },
                    margin: [-4, 5, 0, 0],
                },
                
                data.tutor_live_separated ?
                {
                    table: {
                        body: [
                            [
                                {
                                    text: 'Código postal: ',
                                    border:[false],
                                    margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.tutor_postal_code
                                },
                                {
                                    text: 'Número celular:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.tutor_phone_number,
                                },
                                {
                                    text: 'Celular secundario:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.tutor_secondary_phone_number,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                } :
                {
                    table: {
                        body: [
                            [
                                {
                                    text: 'Código postal: ',
                                    border:[false],
                                    margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.candidate_postal_code
                                },
                                {
                                    text: 'Número celular:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.phone_number,
                                },
                                {
                                    text: 'Celular secundario:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.secondary_phone_number,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                data.tutor_live_separated ?
                {
                    table: {
                        widths:[50,'*',82,'*',],
                        body: [
                            [
                                {
                                    text: 'Estado:',
                                    border:[false],
                                },
                                {
                                    text: data.tutor_state
                                },
                                {
                                    text: 'Municipio:',
                                    border:[false],
                                },
                                {
                                    text: data.tutor_municipality
                                }
                            ],
                            [
                                {
                                    text: 'Colonia:',
                                    border:[false],
                                },
                                {
                                    text: data.tutor_neighborhood
                                },
                                {
                                    text: 'Calle y número:',
                                    border:[false],
                                },
                                {
                                    text: data.tutor_street_and_number
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                } :
                {
                    table: {
                        widths:[50,'*',82,'*',],
                        body: [
                            [
                                {
                                    text: 'Estado:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_state
                                },
                                {
                                    text: 'Municipio:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_municipality
                                }
                            ],
                            [
                                {
                                    text: 'Colonia:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_neighborhood
                                },
                                {
                                    text: 'Calle y número:',
                                    border:[false],
                                },
                                {
                                    text: data.candidate_street_and_number
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
        
        
                // ESCUELA
                {
                    text: 'Secundaria de procedencia:',
                    style: 'subtitle',
                    margin: [0, 15, 0, 5],
                },
        
                {
                    table: {
                        widths:[42,78,'auto','*', 'auto', 'auto'],
                        body: [
                            [
                                {
                                    text: 'Clave: ',
                                    border:[false],
                                    margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.school_key
                                },
                                {
                                    text: 'Tipo:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.school_type,
                                },
                                {
                                    text: 'Promedio:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.average_grade,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                {
                    table: {
                        widths:['auto','*','auto','*', 'auto', '*'],
                        body: [
                            [
                                {
                                    text: 'Nombre: ',
                                    border:[false],
                                    margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.school_name
                                },
                                {
                                    text: 'Estado:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.school_state,
                                },
                                {
                                    text: 'Municipio:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.school_municipality,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                {
                    table: {
                        body: [
                            [
                                {
                                    text: '¿Tiene adeudos?',
                                    border:[false],
                                    margin: [-4, 0, 0, 0],
                                },
                                {
                                    text: data.has_debts ? 'Sí' : 'No',
                                },
                                {
                                    text: 'Tipo de beca:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.scholarship_type,
                                }
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                
                
                // FIMAS
                // FIMAS
                {
                    columns: [
                        {
                            width: '33.33%',
                            table: {
                                widths:['*'],
                                body: [
                                    [
                                        {
                                            text: 'Firma del aspirante \n' + data.name + ' ' + data.first_last_name + ' ' + data.second_last_name,
                                            border:[false, true, false, false],
                                            alignment: 'center',
                                            style: 'smallText'
                                            
                                        }
                                    ]
                                ]
                            },
                            margin: [10, 0, 10, 0],
        
                        },
                        {
                            width: '33.33%',
                            table: {
                                widths:['*'],
                                body: [
                                    [
                                        {
                                            text: 'Firma del tutor \n' + data.tutor_name + ' ' + data.tutor_first_last_name + ' ' + data.tutor_second_last_name,
                                            border:[false, true, false, false],
                                            alignment: 'center',
                                            style: 'smallText'
                                        }
                                    ]
                                ]
                            },
                            margin: [10, 0, 10, 0],
                        },
                        {
                            width: '33.33%',
                            table: {
                                widths:['*'],
                                body: [
                                    [
                                        {
                                            text: 'Firma de quien recibe \n' + 'Servicios escolares',
                                            border:[false, true, false, false],
                                            alignment: 'center',
                                            style: 'smallText'
                                        }
                                    ]
                                ]
                            },
                            margin: [10, 0, 10, 0],
                        }
                    ],
                    margin: [0, 75, 0, 0],
                },
        
        
                // siguiente pagina
        
        
                // BANCO
                {
                    text: 'Solicitud de trámite de aportación',
                    style: {
                        bold: true,
                        fontSize:20,
                        alignment: 'center',
                    },
                    margin: [0, 20, 0, 0],
                },
                
                {
                    table: {
                        widths:['auto','*','auto','*',],
                        body: [
                            [
                                {
                                    text: 'Banco: ',
                                    border:[false],
                                },
                                {
                                    text: data.bank_name
                                },
                                {
                                    text: 'Cuenta:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.bank_account,
                                }
                            ]
                        ]
                    },
                    margin: [0, 30, 0, 0],
                },
                {
                    table: {
                        widths:['auto',190,'auto','*',],
                        body: [
                            [
                                {
                                    text: 'CLABE: ',
                                    border:[false],
                                },
                                {
                                    text: data.bank_clabe,
                                },
                                {
                                    text: 'Monto: ',
                                    border:[false],
                                    margin: [18, 0, 0, 0],
                                },
                                {
                                    text: '$' + data.amount + ' MXN'
                                },
                            ]
                        ]
                    },
                    margin: [0, 5, 0, 0],
                },
                {
                    table: {
                        widths:['auto','*',],
                        body: [
                            [
                                {
                                    text: 'Concepto:',
                                    border:[false],
                                    margin: [15, 0, 0, 0],
                                },
                                {
                                    text: data.concept,
                                }
                            ]
                        ]
                    },
                    margin: [-18, 5, 0, 0],
                },
                {
                    table: {
                        widths:['*',],
                        body: [
                            [
                                {
                                    text: 'Foto del voucher',
                                    margin: [215, 150, 0, 150],
                                }
                            ]
                        ]
                    },
                    margin: [0, 40, 0, 0],
                }
                
        
        
            ],
            styles:{
                title:{
                    bold: true,
                    fontSize:20
                },
                subtitle:{
                    bold: true,
                    fontSize:15,
                },
                smallText:{
                    fontSize: 10,
                }
            }
            
        }

        const pdf = pdfMake.createPdf(docDefinition);

        const base64 = await convertToBase64(pdf);

        return base64;

    } catch (error) {
        logger.error(error);

        throw new Error(MESSAGES.SERVER_ERROR);
    }
}