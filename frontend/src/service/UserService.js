import axios from "axios";

export const loginUser = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/sign-in`)
    return res.data
}