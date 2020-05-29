import io from "socket.io-client";
import { writable, readable } from "svelte/store";
import { icons } from "feather-icons";

export const socket = readable(io("https://side-server.herokuapp.com"));
// export const socket = readable(io("http://localhost:3030"));
export const pc = writable(new RTCPeerConnection());
export const nickName = writable("");
export const localStream = writable();
export const call = writable({
  state: "disconnected",
  user: { id: undefined, nickName: undefined },
});
export const fIcons = readable(icons);
export const isMobile = readable("ontouchstart" in document.documentElement);
