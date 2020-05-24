/**
 * Make offer to other user
 * @param {*} socket
 * @param {*} to
 * @param {*} offer
 * @param {*} nickName
 */
const makeOffer = (socket, to, offer, nickName) => {
  socket.emit("makeOffer", {
    to,
    offer,
    nickName,
  });
};

export default makeOffer;
