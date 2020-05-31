const userTypes =
{
    "DISCONNECTED": "DISCONNECTED", // User is not connected to server
    "GUEST-D": "GUEST-D", // Guest-D is not verified Guest type.
    "GUEST-V": "GUEST-V", // Guest-V is verified on server side Guest type.
    "HOST-T": "HOST-T", // Host-T is Temp Host type.
    "HOST": "HOST" // Host is the oldest user on server - by default - sync and grand HOST-T is depends on this user
};

isUserTypeWithPermission = (currentUserType) =>
{
    return currentUserType === userTypes["HOST"]
        || currentUserType === userTypes["HOST-T"];
}
