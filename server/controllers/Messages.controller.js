const FriendShip = require("../modules/FriendShip.modules");
const Messages = require("../modules/Message.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");

const getFriends = catchAsync(async (req, res) =>{
    const myId = req.user.id
    const friends = await FriendShip.find({
        $or:[
            {user1: myId},
            {user2: myId}
        ]
    })

    if(!friends){
        return next(new AppError("not found Friends", 404))
    }

    const filterUsers = friends.map(value => {
        if(value.user1 === myId){
            return {
                id: value.user2,
                name: value.user2Name
            }
        }else{
            return {
                id: value.user1,
                name: value.user1Name
            }
        }
    })
    


    res.status(200).json({
        filterUsers,
        user: req.user
    })
})

const getMessage = catchAsync(async(req, res) =>{
    const { id } = req.params;
    const userMessages = await Messages.find({
        $or: [
            { senderId: req.user.id, eceiverId: id },
            { senderId: id, eceiverId: req.user.id }
        ]
    });

    res.status(200).json({
        messages: userMessages
    })
})

module.exports = { getFriends, getMessage }