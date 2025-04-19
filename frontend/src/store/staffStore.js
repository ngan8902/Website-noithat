import { create } from "zustand";
import axios from 'axios';

const useStaffStore = create((set) => ({
    staffList: [],
    faceList: [],

    getAllStaff: () => {
        return axios.get(`${process.env.REACT_APP_URL_BACKEND}/staff/all-staff`, {
        }).then(response => {
            console.log(response);
            const { data } = response;
            if (data && data.data) {
                const staffList = data.data;
                set({
                    staffList: staffList 
                })
                return true;
            }
            return false;
        }
        );
    },
    getAllStaffFaceEmbedding: () => {
        return axios.get(`${process.env.REACT_APP_URL_BACKEND}/staff/all-staff-face`, {
        }).then(response => {
            const { data } = response;
            if (data && data.data) {
                const faceList = data.data;
                set({
                    faceList: faceList 
                })
                return true;
            }
            return false;
        }
        );
    },
    removeStaff: (id) => {
        return axios.delete(`${process.env.REACT_APP_URL_BACKEND}/staff/delete-staff/${id}`).then(response => {
            console.log(response);
            set((state) => ({
                staffList: state.staffList
            }));

        }
        );
    },
}));

export default useStaffStore;