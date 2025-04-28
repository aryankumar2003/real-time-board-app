import { createClient,LiveList,LiveMap,LiveObject} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

import { Layer,Color } from "./types/canvas";

const client = createClient({
  throttle:16,
  authEndpoint: "/api/liveblocks-auth",
});

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Cursor = {
  x: number;
  y: number;
};

export type Presence = {
  cursor: Cursor | null;
  selection:string[];
  pencilDraft:[x:number,y:number,presence:number][]|null;
  penColor:Color|null;
  // Add any other presence properties here
};



// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  layers:LiveMap<string,LiveObject<Layer>>;
  layerIds:LiveList<string>;
};


type UserMeta={
  id?:string;
  info?:{
    name?:string;
    picture?:string;
  }
}
// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
// type UserMeta = {
//   id?: string,  // Accessible through `user.id`
//   info?: Json,  // Accessible through `user.info`
// };

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
// type RoomEvent = {};

// Optionally, when using Comments, ThreadMetadata represents metadata on
// each thread. Can only contain booleans, strings, and numbers.
// export type ThreadMetadata = {
//   pinned: boolean;
//   quote: string;
//   time: number;
// };

export const {
  RoomProvider,
  useMyPresence,
  useStorage,

  useOther,
  useOthers,
  useSelf,
  useOthersConnectionIds,
  useHistory,
  useCanRedo,
  useCanUndo,
  useMutation,
  useOthersMapped,
  
  // Other hooks
  // ...
  
} = createRoomContext<
  Presence,
  Storage,
  UserMeta
>(client);
