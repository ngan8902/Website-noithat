const cron = require('node-cron');
const axios = require('axios');



const fetchAllStaff = async () => {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/attendance/off`);
        return response.data.data || [];
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error.response ? error.response.data : error.message);
        return [];
    }
};

const setOffForStaff = async (staff) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const res = await axios.post(`${process.env.BASE_URL}/staff/all-staff`, {
            staffId: staff._id,
            staffcode: staff.staffcode,
            date: today,
            notes: 'Auto set off by cronjob',
        });

        console.log(`[THÀNH CÔNG] tự động cập nhật trạng thái nghỉ cho nhân viên ${staff.staffcode}: ${res.data.message}`);
    } catch (error) {
        console.error(`[LỖI] lỗi khi cập nhật nghỉ cho ${staff.staffcode}:`, error.response ? error.response.data : error.message);
    }
};

cron.schedule('0 13 * * *', async () => {
    console.log('🔔 Tự động cập nhật nhân viên nghỉ lúc 18:00...');

    const staffList = await fetchAllStaff();
    console.log(staffList)

    if (staffList.length === 0) {
        console.log('⚠️ Không có nhân viên nào để cập nhật.');
        return;
    }

    for (const staff of staffList) {
        await setOffForStaff(staff);
    }

    console.log('✅ Tự động cập nhật nhân viên nghỉ thành công.');
}, {
    timezone: 'Asia/Ho_Chi_Minh'
});