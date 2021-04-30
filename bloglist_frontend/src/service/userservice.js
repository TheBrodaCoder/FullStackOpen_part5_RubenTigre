import axios from 'axios'
const baseUrl = '/api/login'

const passLogin = async (formData) => {
  const response = await axios.post(baseUrl, formData)
  return response.data
}


export default { passLogin }