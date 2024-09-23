import { contactMessageUseCase } from "@/config";
import { ContactMessagesGetFilter } from "@/lib/usecases/contact-message/inputs/get-contact-messages-filter";
import { cache } from "react";
import "server-only";

export const getContactMessages = cache(
  async (filter: ContactMessagesGetFilter) => {
    return contactMessageUseCase.getContactMessages(filter);
  }
);
