const MailHelper = require('../helper/MailHelper');

const sendMail = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log(req.body)
        const result = await MailHelper.sendMail({ name, email, message });

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ message: result.message });
        }
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}

module.exports = {
    sendMail
}