import handleUserMediaError from "./handleUserMediaError.js";
/**
 *
 * @param {*} localStream
 * @param {*} pc
 * @param {*} call
 */
const getMedia = async (localStream, pc, call) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.set(stream);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  } catch (e) {
    handleUserMediaError(e);
    call.set({
      ...$call,
      state: "disconnected",
      user: { id: undefined, nickName: undefined },
    });
  }
};

export default getMedia;
