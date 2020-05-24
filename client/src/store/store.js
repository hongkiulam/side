import io from "socket.io-client";
import { writable, readable } from "svelte/store";
import { icons } from "feather-icons";

export const socket = readable(io("http://localhost:3030"));
export const pc = writable(new RTCPeerConnection());
export const nickName = writable("");
export const localStream = writable();
export const call = writable({ state: "disconnected", user: undefined });
export const fIcons = readable(icons);
