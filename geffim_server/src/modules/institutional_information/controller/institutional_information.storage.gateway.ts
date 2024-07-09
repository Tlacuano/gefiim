import { InstitutionalInformation } from "../model/institutional_information";
import { queryDB } from "../../../utils/data_base/db_connection";

export class InstitutionalInformationStorageGateway {
    async getInstitutionalInformation() {
        try {
            const response = await queryDB<InstitutionalInformation[]>("SELECT * FROM institutional_information");
            return response[0];
        } catch (error) {
            throw(error)
        }
    }

    async updateInstitutionalInformation(payload: InstitutionalInformation) {
        try {
            const response = await queryDB('UPDATE institutional_information SET primary_color = ?, secondary_color = ?, logo = ?, main_image = ? WHERE id = 1', 
                [payload.primary_color, payload.secondary_color, payload.logo, payload.main_image]);
            
            return response;
        } catch (error) {
            throw(error)
        }
    }
}