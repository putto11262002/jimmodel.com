import React from "react";

export interface EmailUseCase {
  sendEmail(subject: string, message: string, to?: string): Promise<void>;
}
