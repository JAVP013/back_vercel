// src/routes/email.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/send-email",
  upload.fields([
    { name: "pdf1", maxCount: 1 },
    { name: "pdf2", maxCount: 1 }
  ]),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Obtener la fecha actual
      const currentDate = new Date().toLocaleDateString();

      let deviceInfoText = "";
      let subject = `Archivos para solicitar crédito por el teléfono - ${currentDate}`;
      if (req.body.deviceInfo) {
        try {
          const device = JSON.parse(req.body.deviceInfo);
          deviceInfoText += `Información del dispositivo:\n`;
          deviceInfoText += `Marca: ${device.brand}\n`;
          deviceInfoText += `Modelo: ${device.model}\n`;
          deviceInfoText += `Precio: ${device.price}\n`;
          deviceInfoText += `Año de lanzamiento: ${device.releaseYear}\n`;
          if (device.color) deviceInfoText += `Color: ${device.color}\n`;
          if (device.size) deviceInfoText += `Tamaño: ${device.size}\n`;
          if (device.memory) deviceInfoText += `Memoria: ${device.memory}\n`;
          if (device.cameras) deviceInfoText += `Cámaras: ${device.cameras}\n`;
          subject = `Archivos para solicitar crédito por el teléfono: ${device.brand} ${device.model} - ${currentDate}`;
        } catch (e) {
          console.error("Error al parsear deviceInfo:", e);
        }
      }

      const fixedEmail = process.env.FIXED_EMAIL || "admin@example.com";

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_USER,
        to: fixedEmail,
        subject,
        text: deviceInfoText || "Se adjunta el archivo PDF.\n\n"
      };

      // Preparar adjuntos
      const attachments = [];
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files && files.pdf1 && files.pdf1.length > 0) {
        attachments.push({
          filename: files.pdf1[0].originalname,
          content: files.pdf1[0].buffer
        });
      }
      if (files && files.pdf2 && files.pdf2.length > 0) {
        attachments.push({
          filename: files.pdf2[0].originalname,
          content: files.pdf2[0].buffer
        });
      }
      if (attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      await transporter.sendMail(mailOptions);

      res.json({ message: "Correo enviado correctamente" });
    } catch (error) {
      console.error("Error al enviar correo:", error);
      res.status(500).json({ error: "Error al enviar el correo" });
    }
  })
);

export default router;
