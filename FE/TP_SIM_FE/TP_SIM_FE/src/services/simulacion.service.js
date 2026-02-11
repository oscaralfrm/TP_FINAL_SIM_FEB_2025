import axios from "axios";
import { baseUrl } from "./base.service";

const postSimulacion = async (parametros) => {
    const response = await axios.post(`${baseUrl}/simular`, parametros);
    return response.data; 
};

export default { postSimulacion };