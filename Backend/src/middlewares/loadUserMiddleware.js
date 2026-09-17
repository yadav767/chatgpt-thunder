import userModel from '../models/user.model.js';

async function loadUserMiddleware(req, res, next) {
    try {
        const existingUser = await userModel.findById(req.userId);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found !"
            })
        }
        req.user = existingUser;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error !"
        })
    }
}
export default loadUserMiddleware;