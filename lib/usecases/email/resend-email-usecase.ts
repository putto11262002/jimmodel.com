import { AppError } from "@/lib/errors";
import { EmailUseCase } from "./usecase";
import { Resend } from "resend";
import { EmailConfig } from "@/config/global";

export class ResendEmailUseCase implements EmailUseCase {
  private config: EmailConfig;
  private resend: Resend;

  constructor(config: EmailConfig) {
    this.config = config;
    this.resend = new Resend(config.resendAPIKey);
  }

  async sendEmail(
    subject: string,
    message: string,
    from?: string,
    to?: string
  ): Promise<void> {
    const { error, data } = await this.resend.emails.send({
      to: to || this.config.notificationEmail,
      from: from || this.config.from,
      subject,
      text: message,
    });

    if (error) {
      throw new AppError(error.message, 500, error.name);
    }
  }
}
