import BaseAPIConfig from "./base-api-config"

export default class StorageService {
    controller = "Storage"

    upload(file:File):Promise<string> {
        const formData = new FormData();
        formData.append("file",file);
        return BaseAPIConfig.post(`${this.controller}/upload`, formData,{
            headers:{
                'Content-Type':"multipart/form-data"
            }
        });
    }
}