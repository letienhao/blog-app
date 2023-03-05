import axios ,{AxiosInstance} from 'axios';
class Http {
  instance: AxiosInstance
   constructor(){
    this.instance = axios.create({
      baseURL :'https://json-server-vercel-xfd4.vercel.app/',
      timeout :10000
    })
   }
}
const http = new Http().instance;
export default http
