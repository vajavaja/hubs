import { Networked } from "../bit-components";
import type { EntityID, Message } from "./networking-types";
import { HubsWorld } from "../app";
import HubChannel from "./hub-channel";
import { takeOwnership } from "./take-ownership";
import { messageFor, messageForStorage } from "./message-for";
import { localClientID } from "../bit-systems/networking";
import { unpinMessages } from "../bit-systems/network-send-system";

export interface StorableMessage extends Message {
  version: 1;
}

export async function tryPin(world: HubsWorld, eid: EntityID, hubChannel: HubChannel) {
  if (!localClientID) throw new Error("Tried to unpin before connected to the channel...");
  takeOwnership(world, eid);
  Networked.creator[eid] = APP.getSid("reticulum");

  const nid = APP.getString(Networked.id[eid])!;

  const storableMessage = messageForStorage(world, [eid], [eid], []);
  const fileId = null;
  const fileAccessToken = null;
  const promotionToken = null;
  await hubChannel.pin(nid, storableMessage, fileId, fileAccessToken, promotionToken);
}

export async function tryUnpin(world: HubsWorld, eid: EntityID, hubChannel: HubChannel) {
  if (!localClientID) throw new Error("Tried to unpin before connected to the channel...");
  takeOwnership(world, eid);
  Networked.creator[eid] = APP.getSid(localClientID!);
  const message = messageFor(world, [eid], [eid], [eid], [], false)!;
  unpinMessages.push(message);
  const fileId = null;
  hubChannel.unpin(APP.getString(Networked.id[eid])!, fileId);
}
