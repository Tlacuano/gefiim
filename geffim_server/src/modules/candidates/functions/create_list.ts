import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { convertToBase64 } from '../../../utils/security/base64';
import logger from '../../../config/logs/logger';
import { MESSAGES } from '../../../utils/messages/response_messages';
import { RequestToGenerateListDto } from '../controller/dtos/request_to_generate_list.dto';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateList = async (data:RequestToGenerateListDto) => {
    try {
        const rows = data.candidates.map(candidate => {
            return [
                candidate.no_ficha,
                candidate.full_name,
                candidate.speciality
            ]
        })  

        const docDefinition: TDocumentDefinitions = {
            content: [
                {
                    table: {
                        widths:[200,'*',],
                        body: [
                            [
                                {text : 'Lista  de candidatos', style: 'title', border:[false, false, true],},
                                {
                                    rowSpan: 2,
                                    image: data.logo,
                                    fit: [90, 50],
                                    alignment:'right'
                                    
                                },
                            ],
                            [
                                {text : data.date,  border:[false, false, true], margin: [0, 3, 0, 0],},
                                '',
                            ],
                        ]
                    },
                    layout: {
                        defaultBorder: false,
                    }
                },

                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*'],
                        body: [
                            [
                                { text: 'No. Ficha', style: 'subtitle' },
                                { text: 'Nombre', style: 'subtitle' },
                                { text: 'Especialidad', style: 'subtitle' },
                            ],
                            ...rows
                        ]
                    },
                    margin: [0, 20, 0, 0]
                }
            ],
            styles:{
                title:{
                    bold: true,
                    fontSize:20
                },
                subtitle:{
                    bold: true,
                    fontSize:13,
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