import devConfig from "@/configs/config.development.json";
import productConfig from "@/configs/config.product.json";
import type Config from "@/models/config";
import router from "@/router";
import axios from "axios";
import { useRoute } from 'vue-router';
import { getCurrentUser } from 'vuefire';

if(import.meta.env.DEV){
  (window as any).Config = devConfig;
}else{
  (window as any).Config = productConfig;
}

let BaseAPIConfig = axios.create({ baseURL: ((window as any).Config as Config).BASE_API_URL }); 

BaseAPIConfig.interceptors.request.use(
  async req => {
    const token = await (await getCurrentUser())?.getIdToken();
    req.headers.set("Authorization",token);

    return req;
  }
)

BaseAPIConfig.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error && error.response && error.response.status == 401) {
      const route = useRoute();
      console.log(route);
      router.push("/login");
    }

    if(error && error.response && error.response.status == 403){
      router.push("/403")
    }

    return Promise.reject(error);
  }
);



export default BaseAPIConfig;
