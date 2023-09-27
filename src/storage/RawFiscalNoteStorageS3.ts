import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import RawFiscalNoteStorage from "../domain/interfaces/RawFiscalNoteStorage";
import config from "../config";

export default class RawFiscalNoteStorageS3 implements RawFiscalNoteStorage {
    private client = new S3Client({ region: config.s3Region });
    
    async save(fileName: string, file: Buffer): Promise<void> {
        const params = {
            Bucket: config.s3Bucket,
            Key: `${config.s3FiscalNotePath}/${fileName}`,
            Body: file,
        };
        console.log(params)
        const command = new PutObjectCommand(params);
        await this.client.send(command);
    }
}