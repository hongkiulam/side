/**
 * 
 * @param {*} socket 
 * @param {*} to 
 * @param {*} answer 
 */
const makeAnswer = (socket, to, answer) => {
  socket.emit("makeAnswer", {
    to,
    answer,
  });
};

export default makeAnswer