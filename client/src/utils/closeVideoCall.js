const closeVideoCall = (call, subscribedPc, pc) => {
  call.set({
    state: "disconnected",
    user: { id: undefined, nickName: undefined },
  });
  subscribedPc.close();
  pc.set(new RTCPeerConnection());
};

export default closeVideoCall;
