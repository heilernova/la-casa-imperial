import { ITEM_STATUS_LIST, ITEM_TYPE_LIST } from "./api-items.const";

export type ItemType = typeof ITEM_TYPE_LIST[number];
export type ItemStatus = typeof ITEM_STATUS_LIST[number];

export type ItemFilter = { [key: string]: string };