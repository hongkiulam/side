const closeVideoCall = (call, subscribedPc, pc) => {
  call.set({ state: "disconnected", user: undefined });
  subscribedPc.close();
  pc.set(new RTCPeerConnection());
};

export default closeVideoCall;
