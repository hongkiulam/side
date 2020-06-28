# Side - Video Chat App w/ Youtube Player

Try it live: [https://side.netlify.app](https://side.netlify.app)

### Built using Svelte, WebRTC, Node.js, Express, Socket.IO

This is a repo for my Side Video Chat app, with the front-end code contained within `client`, and back-end code contained within `server`.

After learning about WebRTC and playing around with it while at work, I was inspired to build this app for the purpose watching videos together with my girlfriend while living apart.

### Objectives

- Learn Svelte
- Integrate WebRTC p2p video chat into Svelte, using Socket.IO as a signalling server
- Ability to mute audio and pause video
- Quickly and easily switch between video chat and 'youtube' chat
- Use Youtube Data API to search for videos and directly load them into the player
- Synchronise Youtube playback between peers including play, pause and seeking
- Deploy front-end on Netlify and back-end on Heroku

### TODO

- [ ] Create logo
- [ ] Change up the UI?
- [ ] Youtube stays synced in the background i.e. when switched back to video mode
- [ ] Save nickname in localStorage and ability to change/ update it
