const friendRequests = require("../modules/Friend.modules");
const FriendShip = require("../modules/FriendShip.modules");
const User = require("../modules/User.modules");
const { AppError } = require("../utils/AppErrorHandler");
const catchAsync = require("../utils/catchAsync");

const sentRequest = catchAsync(async (req, res, next) => {
    const { to } = req.params;
    const me = req.user.id;

    const myRequest = await friendRequests.findOne({
        from: me,
        to: to
    });

    if (myRequest) {
        await friendRequests.findByIdAndDelete(myRequest._id);

        return res.status(200).json({
            action: "cancelled",
            message: "Request cancelled"
        });
    }

    const alreadyReceived = await friendRequests.findOne({
        from: to,
        to: me
    });

    if (alreadyReceived) {
        return next(new AppError("reqvest exsit sent", 400));
    }

    const newRequest = await friendRequests.create({
        from: me,
        to: to
    });

    res.status(201).json({
        action: "sent",
        message: "Request sent",
        data: newRequest
    });
});

const getUsers = catchAsync(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new AppError("User not authorized", 401));
    }

    const user = await User.find({ id: { $ne: req.user.id } });
    const users = await User.find();

    const myRequests = await friendRequests.find({ from: req.user.id });
    const isRequests = await friendRequests.find({ to: req.user.id });

    const myRequestsUsers = myRequests.map(value => {
        return user.find(user => user.id === value.to) || null;
    }).filter(Boolean);

    const isRequestsUsers = isRequests.map(value => {
        return user.find(user => user.id === value.from) || null;
    }).filter(Boolean);

    const friendShip = await FriendShip.find();

    const myFriendShips = friendShip.filter(value => value.user1 === req.user.id || value.user2 === req.user.id);

    const friendShipUsers = myFriendShips.map(value => {
        if (req.user.id === value.user1) {
            return users.find(u => u.id === value.user2) || null;
        } else {
            return users.find(u => u.id === value.user1) || null;
        }
    }).filter(Boolean);

    const filteredUsers = user.filter(user => {
        return !isRequests.find(value => value.from === user.id) &&
        !friendShip.find(v =>
            (v.user1 === req.user.id && v.user2 === user.id) ||
            (v.user2 === req.user.id && v.user1 === user.id)
        );
    });

    res.json({
        user: req.user,
        users: filteredUsers,
        isUsers: isRequestsUsers,
        myUsers: myRequestsUsers,
        Friends: friendShipUsers
    });
});
const confrimRequests = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    const newFriends = await friendRequests.findOne({
        from: id,
        to: userId
    });

    if (!newFriends) {
        return next(new AppError("users not Found", 404));
    }

    await newFriends.deleteOne();

    const user1 = await User.findOne({ id: id });
    const user2 = await User.findOne({ id: userId });

    const newFriendShip = new FriendShip({
        user1: id,
        user2: userId,
        user1Name: user1.name + " " + user1.lastname,
        user2Name: user2.name + " " + user2.lastname
    });

    await newFriendShip.save();

    res.status(200).json({
        ok: true,
        newFriendShip
    });
});

const deleteFriend = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const userDelete = await FriendShip.findOne({
        $or: [
            { user1: req.user.id, user2: id },
            { user1: id, user2: req.user.id }
        ]
    });

    if (!userDelete) {
        return next(new AppError("friend not found", 404));
    }

    await FriendShip.deleteOne({ _id: userDelete._id });

    res.json({
        ok: true,
        message: "friend deleted"
    });
});

module.exports = {
    sentRequest,
    getUsers,
    confrimRequests,
    deleteFriend
};